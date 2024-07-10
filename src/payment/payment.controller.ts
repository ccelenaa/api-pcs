import { 
  Body, 
  Controller,
  Get,
  Header,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  RawBodyRequest,
  Req,
  StreamableFile,
  UseGuards } from '@nestjs/common';
import { GetCompte } from 'src/auth/decorator';
import { JwtRequiredGuard, JwtOptionalGuard } from 'src/auth/guard';
import { PaymentService } from './payment.service';
import { location, transaction, voyageur } from '@prisma/client';
import { LocationService } from 'src/location/location.service';
import { BienService } from 'src/bien/bien.service';
import { htmlPdf } from 'src/utils/pdf'
import { createHash } from 'node:crypto'
import { TransactionService } from 'src/transaction/transaction.service';
import { createReadStream } from 'node:fs';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly bienService: BienService,
    private readonly paymentService: PaymentService,
    private readonly locationService: LocationService
  ) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRequiredGuard)
  @Post('locations/:id_bien')
  async bien(
    @Param('id_bien') id_bien: number,
    @GetCompte() compte: voyageur,
    @Headers('Origin') origin: string
  ) {
    const bien = await this.bienService.get(id_bien);
    const location = await this.locationService.create({
      id_bien: BigInt(bien.id),
      id_voyageur: compte.id,
      prix: bien.prix,
      date_debut: new Date(),
      date_fin: new Date(),
    } as location);

    return await this.paymentService.location(compte, location, origin);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRequiredGuard)
  @Post('prestations/:id_prestation')
  async prestation(
    @Param('id_prestation') id_prestation: string,
    @GetCompte() compte: Object,
    @Headers('Origin') origin: string
  ) {
    return await this.paymentService.prestation(compte as voyageur, null, origin);
  }


  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtOptionalGuard)
  @Post('webhooks/intent/success')
  async webhooks(
    @Body() body,
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>
  ) {
    return await this.paymentService.webhooks(req.rawBody, signature);
  }


  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRequiredGuard)
  @Get(':session_id/update')
  async updatePayment(
    @Param('session_id') session_id: string,
    @GetCompte() compte: voyageur,
    @Headers('Origin') origin: string
  ) {
    let payment = await this.paymentService.getSession(session_id);
    const url = payment['charge']['receipt_url'];
    const pdf = `${createHash('sha256').update(url).digest('hex')}.pdf`;

    await htmlPdf(url,`public/receipts/${pdf}`);

    payment = {...payment, receipt: {web: url, pdf}};

    await this.transactionService.update({
      session_id: payment['session']['id'],
      session_status: payment['session']['status'],
      payment_intent: payment['session']['payment_intent'],
      payment_status: payment['session']['payment_status'],
      url: payment['session']['url'],
      data: payment,
      date_modification: new Date()
    } as transaction);
  }

  @Get('receipts/:file')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="recu-paiement.pdf"')
  getStaticFile(@Param('file') file: string): StreamableFile {
    const pdf = createReadStream(`public/receipts/${file}`);
    return new StreamableFile(pdf);
  }
}

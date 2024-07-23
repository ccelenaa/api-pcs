import { 
  BadRequestException,
  Body, 
  Controller,
  Get,
  Header,
  Headers,
  HttpCode,
  HttpException,
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
import { location, Prisma, transaction, voyageur } from '@prisma/client';
import { LocationService } from 'src/location/location.service';
import { BienService } from 'src/bien/bien.service';
import { htmlPdf } from 'src/utils/pdf'
import { createHash } from 'node:crypto'
import { TransactionService } from 'src/transaction/transaction.service';
import { createReadStream } from 'node:fs';
import { PrestationService } from 'src/prestation/prestation.service';
import { PrismaService } from 'src/prisma/prisma.service';

  function isDateInIntervals(intervals, D) {
  
    for (let interval of intervals) {
      const startDate = new Date(interval.date_debut);
      const endDate = new Date(interval.date_fin);
  
      if (D >= startDate && D <= endDate) {
        return true;
      }
    }
  
    return false;
  }

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly transactionService: TransactionService,
    private readonly bienService: BienService,
    private readonly prestationService: PrestationService,
    private readonly paymentService: PaymentService,
    private readonly locationService: LocationService
  ) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRequiredGuard)
  @Post('locations/:id_bien')
  async bien(
    @Param('id_bien') id_bien: bigint,
    @GetCompte() compte: voyageur,
    @Body() body: any,
    @Headers('Origin') origin: string
  ) {
    console.log({body})

    if(!body.date_debut || !body.date_fin) {
      console.log({body})
      throw new BadRequestException('Dates incorrectes');
    }

    const date_debut = new Date(body.date_debut);
    const date_fin = new Date(body.date_fin);
    date_debut.setHours(12, 0, 0, 0);
    date_fin.setHours(12, 0, 0, 0);

    if(date_debut >= date_fin) {
      throw new BadRequestException('Dates incorrectes');
    }

    const bien: any = await this.bienService.get(id_bien);
    if(isDateInIntervals(bien.locations, date_debut) || isDateInIntervals(bien.locations, date_fin)) {
      throw new HttpException('Conflict', HttpStatus.CONFLICT);
    }

    const location = await this.locationService.create({
      id_bien: BigInt(bien.id),
      id_voyageur: compte.id,
      prix: bien.prix,
      date_debut,
      date_fin,
    } as location);

    return await this.paymentService.location(compte, location, origin);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRequiredGuard)
  @Post('prestations/:id_prestation')
  async prestation(
    @Param('id_prestation') id_prestation: number,
    @GetCompte() compte: voyageur,
    @Headers('Origin') origin: string
  ) {
    const prestation = await this.prestationService.get(id_prestation);
    const session = await this.paymentService.prestation(compte, prestation, origin);
    await this.prismaService.prestation.update({
      where: {
        id: prestation.id
      },
      data: {
        statut: 3,
        service: {
          update: {
            statut: 3
          }
        }
      }
    });

    return session;
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

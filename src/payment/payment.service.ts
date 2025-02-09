import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { HttpService, HttpModule } from '@nestjs/axios';
import { location, prestation, voyageur } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { catchError, EMPTY, firstValueFrom, lastValueFrom, map, Observable, retry, RetryConfig } from 'rxjs';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private rabbitmqService: RabbitMQService,
    private httpService: HttpService
  ) {
    // this.subscribes();
  }
  
  async location(voyageur: voyageur, location: location, origin: string): Promise<Object> {
    const url = `${origin}`;

    const data = {
      email: voyageur.email,
      productName: location['bien'].type,
      productDescription: location['bien'].description,
      amount: parseFloat((location['bien'].prix*1.1).toFixed(2)) * 100,
      currency: 'eur',
      metadata: {
        type: `location`,
        id: location['bien'].id,
        product: location['bien'].type,
        price: (location['bien'].prix*1.1).toFixed(2),
        id_compte: voyageur.id,
        type_compte: 'Voyageur',
      },
      successUrl: `${url}/biens?success={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${url}/biens?cancel={CHECKOUT_SESSION_ID}`,
      images: ['https://multilok.fr/wp-content/uploads/2022/11/ICONE-SITE-premium-1.jpg'],
    };

    const paymentHost = this.configService.get('payment.host');

    const response = await firstValueFrom(
      this.httpService.post(
        `${paymentHost}/sessions/create`, data, { responseType: 'json' }
      ).pipe(
        retry({ count: 3, delay: 3000 }),
        catchError(() => {
          return EMPTY;
        })
      )
    );

    const session = response['data'];
    await this.prisma.transaction.create({
      data: {
        id_location: location.id,
        session_id: session.id,
        session_status: session.status,
        payment_intent: session.payment_intent,
        payment_status: session.payment_status,
        amount: session.amount_total,
        url: session.url,
        data: session,
        date_creation: new Date(session.created * 1000),
        date_expiration: new Date(session.expires_at * 1000)
      }
    });
  
    return {id: session.id};    
  }
  
  async prestation(voyageur: voyageur, prestation: prestation, origin: string): Promise<Object> {
    const url = `${origin}`;

    const data = {
      email: voyageur.email,
      productName: 'prestation',
      productDescription: 'prestataion',
      amount: parseFloat((prestation.prix_prestataire*1.1).toFixed(2)) * 100,
      currency: 'eur',
      metadata: {
        type: `prestation`,
        id: prestation.id,
        product: 'prestation',
        price: (prestation.prix_prestataire*1.1).toFixed(2),
        id_compte: voyageur.id,
        type_compte: 'Voyageur',
      },
      successUrl: `${url}/prestations?success={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${url}/prestations?cancel={CHECKOUT_SESSION_ID}`,
      images: ['https://multilok.fr/wp-content/uploads/2022/11/ICONE-SITE-premium-1.jpg'],
    };

    const paymentHost = this.configService.get('payment.host');

    const response = await firstValueFrom(
      this.httpService.post(
        `${paymentHost}/sessions/create`, data, { responseType: 'json' }
      ).pipe(
        retry({ count: 3, delay: 3000 }),
        catchError(() => {
          return EMPTY;
        })
      )
    );

    const session = response['data'];
    await this.prisma.transaction.create({
      data: {
        id_prestation: prestation.id,
        session_id: session.id,
        session_status: session.status,
        payment_intent: session.payment_intent,
        payment_status: session.payment_status,
        amount: session.amount_total,
        url: session.url,
        data: session,
        date_creation: new Date(session.created * 1000),
        date_expiration: new Date(session.expires_at * 1000)
      }
    });
  
    return {id: session.id};    
  }


  async webhooks(body: Buffer, signature: string) {
    return await this.rabbitmqService.publish('bleme.payment.succeded.queue.dlx', 'wait', { signature, body });

    // const paymentUrl = process.env.PAYMENT_API;
    // const response = await firstValueFrom(
    //   this.httpService.post(
      //     `${paymentUrl}/payment/webhooks/event`, body, {responseType: 'json', headers: {signature}}
      //   ).pipe(
        //     retry({count: 12, delay: 3000}),
    //     catchError(() => {
    //       return EMPTY;
    //     })
    //   )
    // );
    // return response['data'];
  }

  async getSession(id: string): Promise<Object> {
    const paymentHost = this.configService.get('payment.host');

    const response = await firstValueFrom(
      this.httpService.get(
        `${paymentHost}/sessions/${id}`, { responseType: 'json' }
      ).pipe(
        retry({ count: 3, delay: 3000 }),
        catchError(() => {
          return EMPTY;
        })
      )
    );

    return response['data'];
  }

  subscribes() {
    this.rabbitmqService.events.on('connected', async () => {
      console.log('[ Bleme ] Rabbitmq "Connnexion" event detected : SUBSCRIBE to queue succeded ...');

      await this.rabbitmqService.subscribe({ queue: 'bleme.payment.succeded.queue', retry: 5000 }, {}, async (msg: any) => {
        console.log('[ Bleme ] [ RabbitMQ ] Message recept : ', { msg });
      });

      console.log('[ Bleme ] ... SUBSCRIPTION OK');
    });
  }
}

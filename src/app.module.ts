import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CompteModule } from './compte/compte.module';
import { BienModule } from './bien/bien.module';
import { PaymentModule } from './payment/payment.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import configuration from './utils/configuration';
import { CronModule } from './facturation/prestataires.module';
import { BailleurModule } from './bailleur/bailleur.module';
import { PrestataireModule } from './prestataire/prestataire.module';
import { VoyageurModule } from './voyageur/voyageur.module';
import { LangueModule } from './langue/langue.module';
import { PrestationModule } from './prestation/prestation.module';
import { ServiceModule } from './service/service.module';
import { LocationModule } from './location/location.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true, load: [configuration]}),
    PaymentModule,
    AuthModule,
    PrismaModule,
    CompteModule,
    BienModule,
    LocationModule,
    BailleurModule,
    PrestataireModule,
    PrestationModule,
    ServiceModule,
    VoyageurModule,
    TransactionModule,
    LangueModule,
    RabbitMQModule,
    CronModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})

export class AppModule {}

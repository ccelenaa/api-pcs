import { Module } from '@nestjs/common';
import { VoyageurService } from './voyageur.service';
import { VoyageurController } from './voyageur.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  imports: [
    AuthModule,
    TransactionModule
  ],
  controllers: [VoyageurController],
  providers: [VoyageurService]
})
export class VoyageurModule {}

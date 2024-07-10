import { Module } from '@nestjs/common';
import { FacturationPrestataireService } from './prestataires.service';
import { ConfigModule } from '@nestjs/config';
import { FacturationPrestataireController } from './prestataires.controller';

@Module({
  providers: [FacturationPrestataireService],
  controllers: [FacturationPrestataireController],
  imports: [ConfigModule]
})
export class CronModule {}

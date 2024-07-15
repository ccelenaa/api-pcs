import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { TypePrestationController } from './service.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrestationModule } from 'src/prestation/prestation.module';

@Module({
  imports: [
    AuthModule,
    PrestationModule
  ],
  controllers: [TypePrestationController],
  providers: [ServiceService]
})
export class ServiceModule {}

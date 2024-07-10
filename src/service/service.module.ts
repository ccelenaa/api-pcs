import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { TypePrestationController } from './service.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [TypePrestationController],
  providers: [ServiceService]
})
export class ServiceModule {}

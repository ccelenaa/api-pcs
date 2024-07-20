import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { TypePrestationController } from './service.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { PrestationModule } from 'src/prestation/prestation.module';
import { join } from 'path';

@Module({
  imports: [
    AuthModule,
    PrestationModule,
    MulterModule.register({
      dest: join(__dirname, '..', 'uploads'), // dossier pour stocker les fichiers
    }),
  ],
  controllers: [TypePrestationController],
  providers: [ServiceService]
})
export class ServiceModule {}

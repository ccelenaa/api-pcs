import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { TypePrestationController } from './service.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { PrestationModule } from 'src/prestation/prestation.module';
import { extname, join } from 'path';
import { diskStorage } from 'multer';

@Module({
  imports: [
    AuthModule,
    PrestationModule,
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, join(process.cwd(), 'public/images'));
        },
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          const name = file.originalname.replace(ext, '');
          const filename = `${name}-${Date.now()}${ext}`;
          cb(null, filename);
        },
      }),
    }),
  ],
  controllers: [TypePrestationController],
  providers: [ServiceService]
})
export class ServiceModule {}

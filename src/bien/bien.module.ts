import { Module } from '@nestjs/common';
import { BienService } from './bien.service';
import { BienController } from './bien.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Module({
  imports: [
    AuthModule,
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
  controllers: [BienController],
  providers: [BienService],
  exports: [BienService]
})
export class BienModule {}

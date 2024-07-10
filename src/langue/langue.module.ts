import { Module } from '@nestjs/common';
import { LangueService } from './langue.service';
import { LangueController } from './langue.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [LangueController],
  providers: [LangueService]
})
export class LangueModule {}

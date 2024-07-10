import { Module } from '@nestjs/common';
import { BailleurService } from './bailleur.service';
import { BailleurController } from './bailleur.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [BailleurController],
  providers: [BailleurService]
})
export class BailleurModule {}

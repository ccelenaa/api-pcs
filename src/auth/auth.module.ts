import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtOptionalStrategy, JwtRequiredStrategy } from './strategy';

@Module({
  imports:     [JwtModule.register({})],
  controllers: [AuthController],
  providers:   [AuthService, JwtOptionalStrategy, JwtRequiredStrategy],
})
export class AuthModule {}

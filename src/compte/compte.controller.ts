import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtRequiredGuard } from 'src/auth/guard';
import { CompteService } from './compte.service';
import { GetCompte } from 'src/auth/decorator'
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('comptes')
export class CompteController {
  constructor(private accountService: CompteService, private prisma: PrismaService) {}

  @UseGuards(JwtRequiredGuard)
  @Get('moi')
  getMe(@GetCompte() compte: Object) {
    return compte;
  }
}

import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { JwtRequiredGuard } from 'src/auth/guard';
import { FacturationPrestataireService } from './prestataires.service';
import { GetCompte } from 'src/auth/decorator'
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('facturations')
export class FacturationPrestataireController {
  constructor(
    private facturationPrestataireService: FacturationPrestataireService
  ) {}

  // @UseGuards(JwtRequiredGuard)
  @Get('prestataires')
  @HttpCode(HttpStatus.OK)
  async lancerFacturationPrestataires() {
    return await this.facturationPrestataireService.facturationPrestataires();
  }

  // @UseGuards(JwtRequiredGuard)
  @Get('prestataires/next')
  @HttpCode(HttpStatus.OK)
  async nextFacturationPrestataires() {
    return await this.facturationPrestataireService.prochaineFacturationPrestataires();
  }
}

import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { PrestataireService } from './prestataire.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('prestataires')
export class PrestataireController {
  constructor(private prestataireService: PrestataireService, private prisma: PrismaService) {}

  /*
  Route: /prestataires
  Recupere tout les prestataires
  */
  @Get()
  @HttpCode(HttpStatus.OK)
  async gets() {
    return this.prestataireService.gets();
  }

  /*
  Route: /prestataires/:id_prestataire
  Recupere le prestataires ayant <id_prestataire>
  */
  @Get(':id_prestataire')
  @HttpCode(HttpStatus.OK)
  async get(@Param('id_prestataire') id_prestataire: number) {
    return this.prestataireService.get(id_prestataire);
  }

  /*
  Route: /prestataires/activation/:id_prestataire
  Recupere le prestataires ayant <id_prestataire>
  */
  @Post('validation/:id_prestataire')
  @HttpCode(HttpStatus.OK)
  async valider(@Param('id_prestataire') id_prestataire: number, @Body('valider') valider: boolean) {
    return this.prestataireService.valider(id_prestataire, valider).then((b: any) => { delete b.password; return b; });
  }

  /*
  Route: /biens/suspenssion/:id_prestataire
  Recupere le bien ayant <id_bien>
  */
  @Post('suspenssion/:id_prestataire')
  @HttpCode(HttpStatus.OK)
  async suspendre(@Param('id_prestataire') id_prestataire: number, @Body('suspendre') suspendre: boolean) {
    return this.prestataireService.suspendre(id_prestataire, suspendre).then((b: any) => { delete b.password; return b; });
  }
}

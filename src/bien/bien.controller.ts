import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { BienService } from './bien.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('biens')
export class BienController {
  constructor(private bienService: BienService, private prisma: PrismaService) {}

  /*
  Route: /biens
  Recupere tout les biens
  */
  @Get()
  @HttpCode(HttpStatus.OK)
  async biens() {
    return this.bienService.gets();
  }

  /*
  Route: /biens/:id_bien
  Recupere le bien ayant <id_bien>
  */
  @Get(':id_bien')
  @HttpCode(HttpStatus.OK)
  async bien(@Param('id_bien') id_bien: number) {
    return this.bienService.get(id_bien);
  }

  /*
  Route: /biens/bailleur/:id_bailleur
  Recupere tout les biens d'u bailleur <id_bailleur>
  */
  @Post('suspenssion/:id_bien')
  @HttpCode(HttpStatus.OK)
  async suspenssion(@Param('id_bien') id_bien: number, @Body('suspendre') suspendre: boolean) {
    return this.bienService.suspenssion(id_bien, suspendre);
  }

  /*
  Route: /biens/bailleur/:id_bailleur
  Recupere tout les biens d'u bailleur <id_bailleur>
  */
  @Post('validation/:id_bien')
  @HttpCode(HttpStatus.OK)
  async validation(@Param('id_bien') id_bien: number, @Body('valider') valider: boolean) {
    return this.bienService.validation(id_bien, valider);
  }

  /*
  Route: /biens/bailleur/:id_bailleur
  Recupere tout les biens d'u bailleur <id_bailleur>
  */
  @Post('bailleur-suspenssion/:id_bien')
  @HttpCode(HttpStatus.OK)
  async bailleur_suspenssion(@Param('id_bien') id_bien: number, @Body('suspendre') suspendre: boolean) {
    return this.bienService.bailleur_suspenssion(id_bien, suspendre);
  }
}

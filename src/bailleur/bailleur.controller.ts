import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { JwtRequiredGuard } from 'src/auth/guard';
import { BailleurService } from './bailleur.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('bailleurs')
export class BailleurController {
  constructor(private bailleurService: BailleurService, private prisma: PrismaService) {}

  /*
  Route: /bailleurs
  Recupere tout les bailleurs
  */
  @Get()
  @HttpCode(HttpStatus.OK)
  async gets() {
    return this.bailleurService.gets();
  }

  /*
  Route: /bailleurs/:id_bailleur
  Recupere le bailleur ayant <id_bailleur>
  */
  @Get(':id_bailleur')
  @HttpCode(HttpStatus.OK)
  async get(@Param('id_bailleur') id_bailleur: number) {
    return this.bailleurService.get(id_bailleur);
  }

  /*
  Route: /bailleurs/activation/:id_bailleur
  Recupere le bailleur ayant <id_bailleur>
  */
  @Post('validation/:id_bailleur')
  @HttpCode(HttpStatus.OK)
  async valider(@Param('id_bailleur') id_bailleur: number, @Body('valider') valider: boolean) {
    return this.bailleurService.valider(id_bailleur, valider).then((b: any) => { delete b.password; return b; });
  }

  /*
  Route: /biens/suspenssion/:id_bailleur
  Recupere le bien ayant <id_bien>
  */
  @Post('suspenssion/:id_bailleur')
  @HttpCode(HttpStatus.OK)
  async suspendre(@Param('id_bailleur') id_bailleur: number, @Body('suspendre') suspendre: boolean) {
    return this.bailleurService.suspendre(id_bailleur, suspendre).then((b: any) => { delete b.password; return b; });
  }
}

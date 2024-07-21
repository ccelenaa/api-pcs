import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { BienService } from './bien.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtRequiredGuard } from 'src/auth/guard';
import { GetCompte } from 'src/auth/decorator';
import { bailleur } from '@prisma/client';
import { join } from 'path';

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
  async bien(@Param('id_bien') id_bien: bigint) {
    return this.bienService.get(id_bien);
  }

  /*
  Route: /biens/:id_bien
  Recupere le bien ayant <id_bien>
  */
  @UseGuards(JwtRequiredGuard)
  @HttpCode(HttpStatus.OK)
  @Get('bailleurs/me')
  async bailleur(@GetCompte() compte: bailleur) {
    return this.bienService.getBailleurBiens(compte.id);
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

  @UseGuards(JwtRequiredGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('ajout')
  @UseInterceptors(FilesInterceptor('images', 10))
  async create(@GetCompte() compte: bailleur, @Body() body: any, @UploadedFiles() files: Array<Express.Multer.File>) {
    return this.bienService.add(compte.id, body, files);
  }
}

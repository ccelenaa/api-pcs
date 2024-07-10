import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { JwtRequiredGuard } from 'src/auth/guard';
import { PrestationService } from './prestation.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('prestations')
export class PrestationController {
  constructor(private prestationService: PrestationService, private prisma: PrismaService) {}

  /*
  Route: /biens
  Recupere tout les biens
  */
  @Get()
  @HttpCode(HttpStatus.OK)
  async gets() {
    return this.prestationService.gets();
  }

  /*
  Route: /biens/:id_bien
  Recupere le bien ayant <id_bien>
  */
  @Get(':id_prestation')
  @HttpCode(HttpStatus.OK)
  async get(@Param('id_prestation') id_prestation: number) {
    return this.prestationService.get(id_prestation);
  }

  /*
  Route: /biens/:id_bien
  Recupere le bien ayant <id_bien>
  */
  @Post(':id_prestation/set/prestataire')
  @HttpCode(HttpStatus.OK)
  async setPrestataire(@Param('id_prestation') id_prestation: number, @Body('id_prestataire') id_prestataire: number|null) {
    return this.prestationService.setPrestataire(id_prestation,id_prestataire);
  }

  /*
  Route: /biens/:id_bien
  Recupere le bien ayant <id_bien>
  */
  @Post(':id_prestation/set/note')
  @HttpCode(HttpStatus.OK)
  async setNote(@Param('id_prestation') id_prestation: number, @Body('note') note: number) {
    return this.prestationService.setNote(id_prestation, note);
  }

  /*
  Route: /biens/:id_bien
  Recupere le bien ayant <id_bien>
  */
  @Get('voyageur/:id_voyageur')
  @HttpCode(HttpStatus.OK)
  async getPrestationVoyageur(@Param('id_voyageur') id_voyageur: number) {
    return this.prestationService.getVoyageurPrestations(id_voyageur);
  }

}

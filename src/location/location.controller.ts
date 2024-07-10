import { Controller, Get, HttpCode, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('locations')
export class LocationController {
  constructor(private locationService: LocationService, private prisma: PrismaService) {}

  /*
  Route: /biens
  Recupere tout les biens
  */
  @Get()
  @HttpCode(HttpStatus.OK)
  async biens() {
    return this.locationService.gets();
  }

  /*
  Route: /biens/:id_bien
  Recupere le bien ayant <id_bien>
  */
  @Get(':id_location')
  @HttpCode(HttpStatus.OK)
  async bien(@Param('id_location') id_location: number) {
    return this.locationService.get(id_location);
  }

  /*
  Route: /biens/:id_bien
  Recupere le bien ayant <id_bien>
  */
  // @Get('prestataire/:id_prestation')
  // @HttpCode(HttpStatus.OK)
  // async prestataire_service(@Param('id_prestation') id_prestation: number) {
  //   return this.locationService.getPrestataireServices(id_prestation);
  // }

}

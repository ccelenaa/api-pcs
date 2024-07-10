import { Controller, Get, HttpCode, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { ServiceService } from './service.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('services')
export class TypePrestationController {
  constructor(private serviceService: ServiceService, private prisma: PrismaService) {}

  /*
  Route: /biens
  Recupere tout les biens
  */
  @Get()
  @HttpCode(HttpStatus.OK)
  async biens() {
    return this.serviceService.gets();
  }

  /*
  Route: /biens/:id_bien
  Recupere le bien ayant <id_bien>
  */
  @Get(':id_service')
  @HttpCode(HttpStatus.OK)
  async bien(@Param('id_service') id_type_prestation: number) {
    return this.serviceService.get(id_type_prestation);
  }

  /*
  Route: /biens/:id_bien
  Recupere le bien ayant <id_bien>
  */
  @Get('prestataire/:id_prestation')
  @HttpCode(HttpStatus.OK)
  async prestataire_service(@Param('id_prestation') id_prestation: number) {
    return this.serviceService.getPrestataireServices(id_prestation);
  }

}

import { Controller, Get, HttpCode, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { ServiceService } from './service.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('services')
export class TypePrestationController {
  constructor(private serviceService: ServiceService, private prisma: PrismaService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async services() {
    return this.serviceService.gets();
  }

  @Get(':id_service')
  @HttpCode(HttpStatus.OK)
  async service(@Param('id_service') id_type_prestation: number) {
    return this.serviceService.get(id_type_prestation);
  }

  @Get('voyageur/:id_voyageur')
  @HttpCode(HttpStatus.OK)
  async voyageur(@Param('id_voyageur') id_voyageur: number) {
    return this.serviceService.getVoyageurServices(id_voyageur);
  }

  @Get('prestataire/:id_prestataire')
  @HttpCode(HttpStatus.OK)
  async prestataire(@Param('id_prestataire') id_prestataire: number) {
    return this.serviceService.getPrestataireServices(id_prestataire);
  }

}

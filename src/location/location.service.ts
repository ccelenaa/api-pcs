import { Injectable } from '@nestjs/common';
import { location } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LocationService {

  constructor(private prisma: PrismaService) { }

  async gets(): Promise<location[]> {
    return await this.prisma.location.findMany();
  }

  async get(id_location: number): Promise<location> {
    return await this.prisma.location.findFirst({
      where: {
        id: id_location
      }
    });
  }

  async create(location: location): Promise<location> {
    return await this.prisma.location.create({
      data: location,
      include: {
        bien: true
      }
    });
  }

  // async getPrestataireServices(id_prestataire: number): Promise<prestataire_service[]> {
  //   return await this.prisma.prestataire_service.findMany({
  //     where: {
  //       id_prestataire
  //     },
  //     include: {
  //       service: true
  //     }
  //   });
  // }

}

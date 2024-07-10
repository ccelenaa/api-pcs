import { Injectable } from '@nestjs/common';
import { service, prestataire_service } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ServiceService {

  constructor(private prisma: PrismaService) { }

  async gets(): Promise<service[]> {
    return await this.prisma.service.findMany();
  }

  async get(id_service: number): Promise<service> {
    return await this.prisma.service.findFirst({
      where: {
        id: id_service
      }
    });
  }

  async getPrestataireServices(id_prestataire: number): Promise<prestataire_service[]> {
    return await this.prisma.prestataire_service.findMany({
      where: {
        id_prestataire
      },
      include: {
        service: true
      }
    });
  }

}

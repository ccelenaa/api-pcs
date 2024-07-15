import { Injectable } from '@nestjs/common';
import { service } from '@prisma/client';
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
      },
      include: {
        prestation: {
          orderBy: {
            date_creation: 'desc'
          }
        }
      }
    });
  }

  async getVoyageurServices(id_voyageur: number): Promise<service[]> {
    return await this.prisma.service.findMany({
      where: {
        id: id_voyageur
      },
      include: {
        prestation: {
          orderBy: {
            date_creation: 'desc'
          }
        }
      }
    });
  }

  async getPrestataireServices(id_prestataire: number): Promise<service[]> {
    return await this.prisma.service.findMany({
      where: {
        id: id_prestataire
      },
      include: {
        prestation: {
          orderBy: {
            date_creation: 'desc'
          }
        }
      }
    });
  }


}

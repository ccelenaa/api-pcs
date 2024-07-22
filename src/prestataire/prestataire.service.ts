import { Injectable } from '@nestjs/common';
import { prestataire } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PrestataireService {

  constructor(private prisma: PrismaService) { }

  async gets(): Promise<prestataire[]> {
    return await this.prisma.prestataire.findMany({
      orderBy: {
        date_creation: 'desc'
      },
      include: {
        prestations: {
          where: {
            date_suppression_admin: null,
            date_suppression_voyageur: null,
            date_suppression_prestataire: null
          }
        },
      }
    });
  }

  async get(id_prestataire: number): Promise<prestataire> {
    return await this.prisma.prestataire.findFirst({
      where: {
        id: id_prestataire
      },
      include: {
        prestations: {
          where: {
            date_suppression_admin: null,
            date_suppression_voyageur: null,
            date_suppression_prestataire: null
          }
        },
      }
    });
  }

  async valider(id_prestataire: number, validation: boolean): Promise<prestataire> {
    return await this.prisma.prestataire.update({
      where: {
        id: id_prestataire
      },
      data: {
        date_validation: validation ? new Date() : null
      },
      include: {
        prestations: {
          where: {
            date_suppression_admin: null,
            date_suppression_voyageur: null,
            date_suppression_prestataire: null
          }
        },
      }
    });
  }

  async suspendre(id_prestataire: number, suspenssion: boolean): Promise<prestataire | Object> {
    return await this.prisma.prestataire.update({
      where: {
        id: id_prestataire
      },
      data: {
        date_suspension: suspenssion ? new Date() : null
      },
      include: {
        prestations: {
          where: {
            date_suppression_admin: null,
            date_suppression_voyageur: null,
            date_suppression_prestataire: null
          }
        },
      }
    });
  }
}

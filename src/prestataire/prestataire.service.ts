import { Injectable } from '@nestjs/common';
import { prestataire } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PrestataireService {

  constructor(private prisma: PrismaService) { }

  async gets(): Promise<prestataire[]> {
    return await this.prisma.prestataire.findMany({
      // include: {
      //   prestation: true,
      // },
      orderBy: {
        date_creation: 'desc'
      }
    });
  }

  async get(id_prestataire: number): Promise<prestataire> {
    return await this.prisma.prestataire.findFirst({
      where: {
        id: id_prestataire
      },
      // include: {
      //   bien: true,
      // }
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
      // include: {
      //   bien: true
      // }
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
      // include: {
      //   bien: true,
      // }
    });
  }
}

import { Injectable } from '@nestjs/common';
import { voyageur } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VoyageurService {

  constructor(private prisma: PrismaService) { }

  async gets(): Promise<voyageur[]> {
    return await this.prisma.voyageur.findMany({
      // include: {
      //   prestation: true,
      // },
      orderBy: {
        date_creation: 'desc'
      }
    });
  }

  async get(id_voyageur: number): Promise<voyageur> {
    return await this.prisma.voyageur.findFirst({
      where: {
        id: id_voyageur
      },
      // include: {
      //   bien: true,
      // }
    });
  }

  async valider(id_voyageur: number, validation: boolean): Promise<voyageur> {
    return await this.prisma.voyageur.update({
      where: {
        id: id_voyageur
      },
      data: {
        date_validation: validation ? new Date() : null
      },
      // include: {
      //   bien: true
      // }
    });
  }

  async suspendre(id_voyageur: number, suspenssion: boolean): Promise<voyageur | Object> {
    return await this.prisma.voyageur.update({
      where: {
        id: id_voyageur
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

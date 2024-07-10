import { Injectable } from '@nestjs/common';
import { prestation } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PrestationService {

  constructor(private prisma: PrismaService) { }

  async gets(): Promise<prestation[]> {
    return await this.prisma.prestation.findMany({
      include: {
        prestataire: true,
        service: true,
        voyageur: true
      },
      orderBy: [{
        date_prestation: 'desc'
      },{
        id: 'desc'
      }]
    });
  }

  async getVoyageurPrestations(id_voyageur: number): Promise<prestation[]> {
    return await this.prisma.prestation.findMany({
      where: {
        id_voyageur
      },
      include: {
        prestataire: true,
        service: true
      },
      orderBy: [{
        date_prestation: 'desc'
      },{
        id: 'desc'
      }]
    });
  }

  async get(id_prestation: number): Promise<prestation> {
    return await this.prisma.prestation.findFirst({
      where: {
        id: id_prestation
      }
    });
  }

  async setPrestataire(id_prestation: number, id_prestataire: number | null): Promise<prestation> {
    return await this.prisma.prestation.update({
      where: {
        id: id_prestation
      },
      data: {
        id_prestataire
      },
      include: {
        prestataire: true,
        service: true,
        voyageur: true
      }
    });
  }

  async setNote(id_prestation: number, note: number): Promise<prestation> {
    return await this.prisma.prestation.update({
      where: {
        id: id_prestation
      },
      data: {
        note
      },
      include: {
        prestataire: true,
        service: true,
      }
    });
  }
}

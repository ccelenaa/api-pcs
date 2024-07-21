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
        service: true
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
        id: 1
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
      },
      include: {
        service: true,
        prestataire: true
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

  async deleteByAdmin(id_prestation: number): Promise<prestation> {
    return await this.prisma.prestation.update({
      where: {
        id: id_prestation
      },
      data: {
        date_suppression_admin: new Date(),
        statut: -1
      },
      include: {
        service: true
      }
    });
  }

  async deleteByVoyageur(id_prestation: number): Promise<prestation> {
    return await this.prisma.prestation.update({
      where: {
        id: id_prestation
      },
      data: {
        date_suppression_voyageur: new Date(),
        statut: -1
      },
      include: {
        service: true
      }
    });
  }

  async deleteByPrestataire(id_prestation: number): Promise<prestation> {
    return await this.prisma.prestation.update({
      where: {
        id: id_prestation
      },
      data: {
        date_suppression_prestataire: new Date(),
        statut: -1
      },
      include: {
        service: true
      }
    });
  }

}

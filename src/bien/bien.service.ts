import { Injectable } from '@nestjs/common';
import { bien } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BienService {

  constructor(private prisma: PrismaService) { }

  async gets(): Promise<bien[]> {
    return await this.prisma.bien.findMany({
      include: {
        bailleur: true
      },
      orderBy: {
        id: 'asc'
      }
    });
  }

  async get(id_bien: number): Promise<bien> {
    return await this.prisma.bien.findFirst({
      include: {
        bailleur: true
      },
      where: {
        id: id_bien
      }
    });
  }

  async validation(id_bien: number, validation: boolean): Promise<bien> {
    return await this.prisma.bien.update({
      where: {
        id: id_bien
      },
      data: {
        date_validation: validation ? new Date() : null
      },
      include: {
        bailleur: true
      }
    });
  }

  async suspenssion(id_bien: number, suspenssion: boolean): Promise<bien | Object> {
    return await this.prisma.bien.update({
      where: {
        id: id_bien
      },
      data: {
        date_suspension: suspenssion ? new Date() : null
      },
      include: {
        bailleur: true
      }
    });
  }

  async bailleur_suspenssion(id_bien: number, suspenssion: boolean): Promise<bien | Object> {
    return await this.prisma.bien.update({
      where: {
        id: id_bien
      },
      data: {
        date_suspension_bailleur: suspenssion ? new Date() : null
      },
      include: {
        bailleur: true
      }
    });
  }
}

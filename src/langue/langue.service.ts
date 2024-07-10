import { Injectable } from '@nestjs/common';
import { langue } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LangueService {

  constructor(private prisma: PrismaService) {}

  async gets(): Promise<langue[]> {
    return await this.prisma.langue.findMany({
      orderBy: {
        date_creation: 'desc'
      }
    });
  }

  async get(langue: string): Promise<langue> {
    return await this.prisma.langue.findFirst({
      where: {
        langue: langue
      }
    });
  }

  async supprimer(id_langue: number): Promise<langue> {
    return await this.prisma.langue.update({
      where: {
        id: id_langue
      },
      data: {
        date_creation: new Date()
      }
    });
  }
}

import { Injectable } from '@nestjs/common';
import { bien, photo, service } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BienService {

  constructor(private prisma: PrismaService) { }

  async gets(): Promise<bien[]> {
    return await this.prisma.bien.findMany({
      include: {
        bailleur: true,
        photos: {
          where: {
            model: 'bien'
          }
        }
      },
      orderBy: {
        date_creation: 'desc'
      }
    });
  }

  async getBailleurBiens(id_bailleur): Promise<bien[]> {
    return await this.prisma.bien.findMany({
      where: {
        id_bailleur
      },
      include: {
        bailleur: true,
        photos: {
          where: {
            model: 'bien'
          }
        }
      },
      orderBy: {
        date_creation: 'desc'
      }
    });
  }

  async get(id_bien: bigint): Promise<bien> {
    return await this.prisma.bien.findFirst({
      include: {
        bailleur: true,
        locations: {
          include: {
            voyageur: true
          }
        },
        photos: {
          where: {
            model: 'bien'
          }
        },
      },
      where: {
        id: id_bien
      }
    });
  }

  async add(id_bailleur, data, files): Promise<bien> {
    console.log(JSON.stringify(data));
    const bien = await this.prisma.bien.create({
      data: {
        id_bailleur,
        statut: 'disponible',
        type: data.type,
        titre: data.titre,
        description: data.description,
        surface: data.surface,
        adresse: data.adresse,
        prix: +data.prix,
        contact: data.contact,
        devise: '€'
      } as bien
    });

    await Promise.all(files.map((file) => this.prisma.photo.create({
      data: {
        model: 'bien',
        id_model: bien.id,
        url: file.filename
      } as photo
    })));

    return await this.get(bien.id);
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
        bailleur: true,
        photos: {
          where: {
            model: 'bien'
          }
        }
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
        bailleur: true,
        photos: {
          where: {
            model: 'bien'
          }
        }
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
        bailleur: true,
        photos: {
          where: {
            model: 'bien'
          }
        }
      }
    });
  }
}

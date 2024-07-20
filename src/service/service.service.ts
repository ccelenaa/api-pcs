import { Injectable } from '@nestjs/common';
import { photo, prestation, service } from '@prisma/client';
import { PrestationService } from 'src/prestation/prestation.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ServiceService {

  constructor(private prisma: PrismaService, private prestationService: PrestationService) { }

  async gets(): Promise<service[]> {
    return await this.prisma.service.findMany({
      include: {
        voyageur: true,
        prestations: {
          orderBy: {
            date_creation: 'desc'
          }
        }
      }
    });
  }

  async get(id_service: bigint): Promise<service> {
    return await this.prisma.service.findFirst({
      where: {
        id: id_service
      },
      include: {
        voyageur: true,
        prestations: {
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
        id_voyageur
      },
      include: {
        voyageur: true,
        prestations: {
          orderBy: {
            date_creation: 'desc'
          },
          include: {
            prestataire: true
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
        prestations: {
          orderBy: {
            date_creation: 'desc'
          }
        }
      }
    });
  }

  async add(id_voyageur, data, files): Promise<service> {
    const service = await this.prisma.service.create({
      data: {
        id_voyageur,
        label: data.label,
        adresse: data.adresse,
        date: new Date(),
        prix_min: data.prix_min ? data.prix_min : 0,
        prix_max: data.prix_max ? data.prix_max : 0,
        data: {description: data.description}
      },
      include: {
        voyageur: true
      }
    });

    await Promise.all(files.map((file) => this.prisma.photo.create({
      data: {
        model: 'service',
        id_model: service.id,
        url: file.filename
      } as photo
    })));

    return await this.get(service.id);
  }


  async setPrestataire(id_service: number, id_prestataire: number | null): Promise<service> {
    await this.prisma.prestation.updateMany({
      where: {
        id_service,
        date_suppression_admin: null,
        date_suppression_voyageur: null,
        date_suppression_prestataire: null
      },
      data: {
        date_suppression_admin: new Date(),
        statut: -1
      },
    });

    const service = await this.prisma.service.update({
      where: {
        id: id_service
      },
      data: {
        statut: id_prestataire > 0 ? 1 : 0
      },
      select: {
        id: true,
        date: true
      }
    });

    if(id_prestataire > 0) {
      await this.prisma.prestation.create({
        data: {
          id_service,
          id_prestataire,
          date_prestation: service.date
        }
      });
    }

    return await this.get(BigInt(id_service));
  }

  async deleteByAdmin(id: number): Promise<service> {
    return await this.prisma.service.update({
      where: {
        id
      },
      data: {
        date_admin_suppression: new Date()
      },
      include: {
        voyageur: true,
        prestations: {
          orderBy: {
            date_creation: 'desc'
          }
        }
      }
    });
  }

  async deleteByVoyageur(id: number): Promise<service> {
    return await this.prisma.service.update({
      where: {
        id
      },
      data: {
        date_voyageur_suppression: new Date()
      },
      include: {
        voyageur: true,
        prestations: {
          orderBy: {
            date_creation: 'desc'
          }
        }
      }
    });
  }


  async deletePrestationByAdmin(id_prestation: number): Promise<service> {
    const {id_service} = await this.prestationService.deleteByAdmin(id_prestation);

    return await this.get(BigInt(id_service));
  }

  async deletePrestationByVoyageur(id_prestation: number): Promise<service> {
    const {id_service} = await this.prestationService.deleteByVoyageur(id_prestation);

    return await this.get(BigInt(id_service));
  }

  async deletePrestationByPrestataire(id_prestation: number): Promise<service> {
    const {id_service} = await this.prestationService.deleteByPrestataire(id_prestation);

    return await this.get(BigInt(id_service));
  }

}

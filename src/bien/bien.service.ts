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
        photos: {
          where: {
            model: 'bien'
          }
        }
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
        statut: 'statut',
        type: data.type,
        titre: data.titre,
        description: data.description,
        surface: data.surface,
        adresse: data.adresse,
        prix: +data.prix,
        contact: data.contact,

        // adresse: data.adresse,
        // date: new Date(data.date),
        // prix_min: data.prix_min ? +data.prix_min : 0,
        // prix_max: data.prix_max ? +data.prix_max : 0
      } as bien,
      include: {
        photos: true
      }
    });

    // id BIGSERIAL,
    // id_bailleur bigint NOT NULL,
    // type character varying(64) NOT NULL,
    // surface character varying(255) NOT NULL,
    // description character varying(1024) NOT NULL,
    // statut character varying(64) NOT NULL,
    // prix real DEFAULT 0 NOT NULL,
    // pcs_marge real DEFAULT 0 NOT NULL,
    // prix_client real DEFAULT 0 NOT NULL,
    // devise character varying(32) DEFAULT 'eu'::character varying NOT NULL,
    // data jsonb DEFAULT '{}'::jsonb NOT NULL,
    // date_suspension_bailleur timestamp(3) without time zone,
    // date_validation timestamp(3) without time zone,
    // date_suspension timestamp(3) without time zone,
    // date_creation timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    // date_modification timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    // date_suppression timestamp(3) without time zone,


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

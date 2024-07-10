import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { VoyageurService } from './voyageur.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { GetCompte } from 'src/auth/decorator';
import { voyageur } from '@prisma/client';
import { JwtRequiredGuard } from 'src/auth/guard';

@Controller('voyageurs')
export class VoyageurController {
  constructor(
    private voyageurService: VoyageurService,
    private transactionService: TransactionService
  ) {}

  /*
  Route: /voyageurs
  Recupere tout les voyageurs
  */
  @Get()
  @HttpCode(HttpStatus.OK)
  async gets() {
    return this.voyageurService.gets();
  }

  /*
  Route: /voyageurs/:id_voyageur
  Recupere le voyageurs ayant <id_voyageur>
  */
  @Get(':id_voyageur')
  @HttpCode(HttpStatus.OK)
  async get(@Param('id_voyageur') id_voyageur: number) {
    return this.voyageurService.get(id_voyageur);
  }

  /*
  Route: /voyageurs/:id_voyageur
  Recupere le voyageurs ayant <id_voyageur>
  */
  @Get(':id_voyageur/transactions')
  @UseGuards(JwtRequiredGuard)
  @HttpCode(HttpStatus.OK)
  async transactions(@GetCompte() voyageur: voyageur) {
    return this.transactionService.getsVoyageur(Number(voyageur.id));
  }

  /*
  Route: /voyageurs/activation/:id_voyageur
  Recupere le voyageurs ayant <id_voyageur>
  */
  @Post('validation/:id_voyageur')
  @HttpCode(HttpStatus.OK)
  async valider(@Param('id_voyageur') id_voyageur: number, @Body('valider') valider: boolean) {
    return this.voyageurService.valider(id_voyageur, valider).then((b: any) => { delete b.password; return b; });
  }

  /*
  Route: /voyageurs/suspenssion/:id_voyageur
  Recupere le voyageur ayant <id_voyageur>
  */
  @Post('suspenssion/:id_voyageur')
  @HttpCode(HttpStatus.OK)
  async suspendre(@Param('id_voyageur') id_voyageur: number, @Body('suspendre') suspendre: boolean) {
    return this.voyageurService.suspendre(id_voyageur, suspendre).then((b: any) => { delete b.password; return b; });
  }
}

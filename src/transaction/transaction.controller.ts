import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { JwtRequiredGuard } from 'src/auth/guard';
import { TransactionService } from './transaction.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  /*
  Route: /langues
  Recupere tout les langues
  */
  @Get()
  @HttpCode(HttpStatus.OK)
  async gets() {
    return this.transactionService.gets();
  }

  /*
  Route: /langues/:id_langue
  Recupere le langue ayant <id_langue>
  */
  @Get(':id_session')
  @HttpCode(HttpStatus.OK)
  async get(@Param('id_session') id_session: string) {
    return this.transactionService.get(id_session);
  }

}

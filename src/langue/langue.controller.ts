import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { JwtRequiredGuard } from 'src/auth/guard';
import { LangueService } from './langue.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Controller('langues')
export class LangueController {
  constructor(private langueService: LangueService, private prisma: PrismaService) {}

  /*
  Route: /langues
  Recupere tout les langues
  */
  @Get()
  @HttpCode(HttpStatus.OK)
  async gets() {
    return this.langueService.gets();
  }


  private loadJson(langue: string): Object {
    const filePath = path.join(__dirname, `i18n/${langue}.json`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  }

  /*
  Route: /langues/:id_langue
  Recupere le langue ayant <id_langue>
  */
  @Get(':langue')
  @HttpCode(HttpStatus.OK)
  async get(@Param('langue') langue: string) {
    return this.loadJson(langue);
  }

  /*
  Route: /biens/suspenssion/:id_langue
  Recupere le bien ayant <id_bien>
  */
  @Delete('suspenssion/:id_langue')
  @HttpCode(HttpStatus.OK)
  async suspendre(@Param('id_langue') id_langue: number) {
    return this.langueService.supprimer(id_langue);
  }
}

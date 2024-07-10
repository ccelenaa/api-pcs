import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('liveness')
  liveness(): Record<string, any> {
    return this.appService.liveness();
  }


  @Get('readiness')
  async readiness(): Promise<Record<string, string>> {
    return this.appService.readiness();
  }
}

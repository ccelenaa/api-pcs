import {Injectable, InternalServerErrorException, ServiceUnavailableException} from '@nestjs/common';
import {PrismaService} from './prisma/prisma.service';
import { RabbitMQService } from './rabbitmq/rabbitmq.service';
const {name, version} = require("./../package.json");

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService, private rabbitmq: RabbitMQService) {}

  liveness(): Record<string, number> {
    return {name, version};
  }

  private services (): Record<string, Function> {
    return {
      postgres: () => this.prisma.$queryRaw`
        SELECT 1
      `,
      // rabbitmq: () => {
      //   if(!this.rabbitmq.isConnected()) {
      //     throw new Error('Rabbitmq error');
      //   }
      // }
    }
  };

  async readiness(): Promise<Record<string, any>> {
    const response = {name, version, services: {}};
    let readiness = true;

    for (const [service, isAvailable] of Object.entries(this.services())) {
      try {
        await isAvailable();

        response.services[service] = 'UP';
      } catch (err) {
        console.error({service, err});

        readiness = false;

        response.services[service] = `DOWN: ${err.message}`;
      }
    }

    // if(!readiness) {
    //   throw new ServiceUnavailableException(response);
    // }

    return response;
  }
}

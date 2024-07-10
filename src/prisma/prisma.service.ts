import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient{
    constructor(private configService: ConfigService) {
        super({
            datasources: {
                db: {
                    url: configService.get('databases.postgres.url')
                }
            },
            // log: [
            //     {
            //       emit: 'stdout',
            //       level: 'query',
            //     },
            //     {
            //       emit: 'stdout',
            //       level: 'error',
            //     },
            //     {
            //       emit: 'stdout',
            //       level: 'info',
            //     },
            //     {
            //       emit: 'stdout',
            //       level: 'warn',
            //     },
            //   ],
        });

        // this.$on('query', (e) => {
        //     console.log('Query: ' + e.query)
        //     console.log('Params: ' + e.params)
        //     console.log('Duration: ' + e.duration + 'ms')
        // });
    }
}

import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [RabbitMQService],
  exports: [RabbitMQService]
})
export class RabbitMQModule {}

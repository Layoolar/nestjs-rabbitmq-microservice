import { NestFactory } from '@nestjs/core';
import { RmqService } from '@app/common';
import { EmailModule } from './email.module';

async function bootstrap() {
  const app = await NestFactory.create(EmailModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('email'));
  await app.startAllMicroservices();
}
bootstrap();

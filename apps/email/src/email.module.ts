import { Module } from '@nestjs/common';
import { RmqModule } from '@app/common';
import * as Joi from 'joi';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_EMAIL_QUEUE: Joi.string().required(),
      }),
    }),
    RmqModule,
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}

import { Controller, Get, UseGuards } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { EmailService } from './email.service';

@Controller()
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly rmqService: RmqService,
  ) {}

  @Get()
  getHello(): string {
    return this.emailService.getHello();
  }

  @EventPattern('user_created')
  async handleUserCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    this.emailService.sendMessage(data);
    this.emailService.sendEmail(data)
    this.rmqService.ack(context);
  }
}

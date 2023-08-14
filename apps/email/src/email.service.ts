import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  getHello(): string {
    return 'Hello World!';
  }

  sendMessage(data: string) {
    this.logger.log('Email...', data);
  }


  sendEmail(data: string) {
    // Send Email
  }
}

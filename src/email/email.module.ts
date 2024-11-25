import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { EmailController } from './email.controller';

@Module({
  controllers: [EmailController], 
  providers: [EmailService], 
  imports: [MailerModule, ConfigModule], 
  exports: [EmailService], 
})
export class EmailModule {}

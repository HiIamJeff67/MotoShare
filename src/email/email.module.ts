import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [EmailService], 
  imports: [MailerModule, ConfigModule], 
  exports: [EmailService], 
})
export class EmailModule {}

import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { ConfigService } from '@nestjs/config';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  providers: [NotificationGateway, NotificationService], 
  imports: [DrizzleModule], 
})
export class NotificationModule {}

import { Module } from '@nestjs/common';
import { PassengerNotificationService } from './passenerNotification.service';
import { NotificationGateway } from './notification.gateway';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { RidderNotificationService } from './ridderNotification.service';

@Module({
  imports: [DrizzleModule], 
  providers: [
    NotificationGateway, 
    PassengerNotificationService, 
    RidderNotificationService
  ], 
  exports: [PassengerNotificationService, RidderNotificationService], 
})
export class NotificationModule {}

import { Module } from '@nestjs/common';
import { PassengerNotificationService } from './passenerNotification.service';
import { NotificationGateway } from './notification.gateway';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { RidderNotificationService } from './ridderNotification.service';
import { PassengerNotificationController } from './passengerNotification.controller';
import { RidderNotificationController } from './ridderNotification.controller';

@Module({
  imports: [DrizzleModule], 
  controllers: [
    PassengerNotificationController, 
    RidderNotificationController
  ], 
  providers: [
    NotificationGateway, 
    PassengerNotificationService, 
    RidderNotificationService
  ], 
  exports: [
    PassengerNotificationService, 
    RidderNotificationService
  ], 
})
export class NotificationModule {}

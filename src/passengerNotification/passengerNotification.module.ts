import { Module } from '@nestjs/common';
import { NotificationService } from './passenerNotification.service';
import { NotificationGateway } from './passengerNotification.gateway';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  providers: [NotificationGateway, NotificationService], 
  imports: [DrizzleModule], 
})
export class NotificationModule {}

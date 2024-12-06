import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [DrizzleModule, NotificationModule],
})
export class OrderModule {}

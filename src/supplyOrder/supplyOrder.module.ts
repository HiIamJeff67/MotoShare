import { Module } from '@nestjs/common';
import { SupplyOrderService } from './supplyOrder.service';
import { SupplyOrderController } from './supplyOrder.controller';
import { DrizzleModule } from '../../src/drizzle/drizzle.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  controllers: [SupplyOrderController],
  providers: [SupplyOrderService],
  imports: [DrizzleModule, NotificationModule],
})
export class SupplyOrderModule {}

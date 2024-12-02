import { Module } from '@nestjs/common';
import { PurchaseOrderService } from './purchaseOrder.service';
import { PurchaseOrderController } from './purchaseOrder.controller';
import { DrizzleModule } from '../../src/drizzle/drizzle.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  controllers: [PurchaseOrderController],
  providers: [PurchaseOrderService],
  imports: [DrizzleModule, NotificationModule],
})
export class PurchaseOrderModule {}

import { Module } from '@nestjs/common';
import { PeriodicPurchaseOrderService } from './periodicPurchaseOrder.service';
import { PeriodicPurchaseOrderController } from './periodicPurchaseOrder.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  controllers: [PeriodicPurchaseOrderController],
  providers: [PeriodicPurchaseOrderService],
  imports: [DrizzleModule], 
})
export class PeriodicPurchaseOrderModule {}

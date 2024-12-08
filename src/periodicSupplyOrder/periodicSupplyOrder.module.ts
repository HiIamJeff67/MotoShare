import { Module } from '@nestjs/common';
import { PeriodicSupplyOrderService } from './periodicSupplyOrder.service';
import { PeriodicSupplyOrderController } from './periodicSupplyOrder.controller';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  controllers: [PeriodicSupplyOrderController],
  providers: [PeriodicSupplyOrderService],
  imports: [DrizzleModule], 
})
export class PeriodicSupplyOrderModule {}

import { Module } from '@nestjs/common';
import { SupplyOrderService } from './supplyOrder.service';
import { SupplyOrderController } from './supplyOrder.controller';
import { DrizzleModule } from '../../src/drizzle/drizzle.module';

@Module({
  controllers: [SupplyOrderController],
  providers: [SupplyOrderService],
  imports: [DrizzleModule],
})
export class SupplyOrderModule {}

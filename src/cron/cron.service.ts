import { Inject, Injectable } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { PurchaseOrderTable } from '../drizzle/schema/purchaseOrder.schema';
import { and, eq, lte, or } from 'drizzle-orm';
import { SupplyOrderTable } from '../drizzle/schema/supplyOrder.schema';

@Injectable()
export class CronService {
  constructor(
    private config: ConfigModule, 
    @Inject(DRIZZLE) private db: DrizzleDB, 
  ) {}

  /* ================================= Automated Delete operations ================================= */
  async deleteExpiredPurchaseOrders() {
    return await this.db.delete(PurchaseOrderTable)
      .where(or(
        eq(PurchaseOrderTable.status, "EXPIRED"), 
        lte(PurchaseOrderTable.startAfter, new Date()), 
      )).returning({
        id: PurchaseOrderTable.id, 
      });
  }

  async deleteExpiredSupplyOrders() {
    return await this.db.delete(SupplyOrderTable)
      .where(or(
        eq(SupplyOrderTable.status, "EXPIRED"), 
        lte(SupplyOrderTable.startAfter, new Date()), 
      )).returning({
        id: SupplyOrderTable.id, 
      });
  }
  /* ================================= Automated Delete operations ================================= */
}

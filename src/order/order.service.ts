import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { eq } from 'drizzle-orm';
import { SupplyOrderTable } from '../drizzle/schema/supplyOrder.schema';

@Injectable()
export class OrderService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  /* ================================= Create operations ================================= */
  async createOrderByPassenger( // Passenger choose a supplyOrder, SupplyOrder -> Order
    id: string,
    orderId: string,
  ) {
    const supplyOrder = await this.db.query.SupplyOrderTable.findFirst({
      where: eq(SupplyOrderTable.id, orderId),
      columns: {
        creatorId: true,
        initPrice: true,
        startCord: true,
        startAfter: true,
      }
    });
    
  }

  async createOrderByRidder(  // Ridder choose a purchaseOrder, PurchaseOrder -> Order
    id: string,
    orderId: string,
  ) {

  }
  /* ================================= Create operations ================================= */



  /* ================================= Get operations ================================= */
  findAll() {
    return `This action returns all order`;
  }

  /* ================= Search operations ================= */
  findOne(id: number) {
    return `This action returns a #${id} order`;
  }
  /* ================= Search operations ================= */

  /* ================================= Get operations ================================= */



  /* ================================= Update operations ================================= */
  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }
  /* ================================= Update operations ================================= */



  /* ================================= Delete operations ================================= */
  remove(id: number) {
    return `This action removes a #${id} order`;
  }
  /* ================================= Delete operations ================================= */
}

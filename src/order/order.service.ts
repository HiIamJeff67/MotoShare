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
  
  /* ================================= Create operations ================================= */



  /* ================================= Get operations ================================= */
  

  /* ================= Search operations ================= */
  
  /* ================= Search operations ================= */

  /* ================================= Get operations ================================= */



  /* ================================= Update operations ================================= */
  
  /* ================================= Update operations ================================= */



  /* ================================= Delete operations ================================= */
  
  /* ================================= Delete operations ================================= */
}

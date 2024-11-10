import { UpdateOrderDto } from './dto/update-order.dto';
import { DrizzleDB } from '../drizzle/types/drizzle';
export declare class OrderService {
    private db;
    constructor(db: DrizzleDB);
    createOrderByPassenger(id: string, orderId: string): Promise<void>;
    createOrderByRidder(id: string, orderId: string): Promise<void>;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateOrderDto: UpdateOrderDto): string;
    remove(id: number): string;
}

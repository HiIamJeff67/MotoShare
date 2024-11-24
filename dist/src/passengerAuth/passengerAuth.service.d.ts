import { ConfigService } from '@nestjs/config';
import { DrizzleDB } from '../drizzle/types/drizzle';
export declare class PassengerAuthService {
    private config;
    private db;
    constructor(config: ConfigService, db: DrizzleDB);
}

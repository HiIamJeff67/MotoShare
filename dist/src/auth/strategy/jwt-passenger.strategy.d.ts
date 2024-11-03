import { ConfigService } from "@nestjs/config";
import { Strategy } from "passport-jwt";
import { DrizzleDB } from "../../../src/drizzle/types/drizzle";
declare const JwtPassengerStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtPassengerStrategy extends JwtPassengerStrategy_base {
    private config;
    private db;
    constructor(config: ConfigService, db: DrizzleDB);
    validate(payload: {
        sub: string;
        email: string;
    }): Promise<{
        id: string;
        userName: string;
        email: string;
    }[]>;
}
export {};

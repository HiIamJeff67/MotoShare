import { ConfigService } from "@nestjs/config";
import { Strategy } from "passport-jwt";
import { DrizzleDB } from "../../drizzle/types/drizzle";
declare const JwtRidderStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtRidderStrategy extends JwtRidderStrategy_base {
    private config;
    private db;
    constructor(config: ConfigService, db: DrizzleDB);
    validate(req: Request, payload: {
        sub: string;
        email: string;
    }): Promise<any>;
}
export {};

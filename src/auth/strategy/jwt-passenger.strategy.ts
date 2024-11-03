import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { eq } from "drizzle-orm";
import { DRIZZLE } from "../../../src/drizzle/drizzle.module";
import { DrizzleDB } from "../../../src/drizzle/types/drizzle";

import { PassengerTable } from "../../../src/drizzle/schema/passenger.schema";

@Injectable()
export class JwtPassengerStrategy extends PassportStrategy(
    Strategy, 
    'jwt-passenger',  // use in JwtGuard default to be 'jwt'
) {
    constructor(
        private config: ConfigService,
        @Inject(DRIZZLE) private db: DrizzleDB,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get("JWT_SECRET"),
        });
    }

    async validate(
        payload: {  // since we use id + email to generate the token
            sub: string,
            email: string,
        }
    ) {
        const user = await this.db.select({
            id: PassengerTable.id,
            userName: PassengerTable.userName,
            email: PassengerTable.email,
        }).from(PassengerTable)
          .where(eq(PassengerTable.id, payload.sub))
          .limit(1);
        
        return user;
    }
}
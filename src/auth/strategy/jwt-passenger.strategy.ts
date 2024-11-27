import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { eq } from "drizzle-orm";
import { DRIZZLE } from "../../../src/drizzle/drizzle.module";
import { DrizzleDB } from "../../../src/drizzle/types/drizzle";

import { PassengerTable } from "../../../src/drizzle/schema/passenger.schema";
import { ClientInvalidTokenException, ClientTokenExpiredException } from "../../exceptions";
import { Request } from "express";

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
            passReqToCallback: true, 
        });
    }

    async validate(
        req: Request, 
        payload: {  // since we use id + email to generate the token
            sub: string,
            email: string,
        }
    ) {
        let user: any = undefined;

        user = await this.db.select({
            id: PassengerTable.id,
            userName: PassengerTable.userName,
            email: PassengerTable.email,
            accessToken: PassengerTable.accessToken, 
        }).from(PassengerTable)
          .where(eq(PassengerTable.id, payload.sub))
          .limit(1);
        if (!user || user.length === 0) {
            throw ClientInvalidTokenException;
        }
        
        const userData = user[0];
        const currentToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        if (currentToken !== userData.accessToken) {
            throw ClientTokenExpiredException;
        }

        delete userData.accessToken;
        
        return userData;
    }
}
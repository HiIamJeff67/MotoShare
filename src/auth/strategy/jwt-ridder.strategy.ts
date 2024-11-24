import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { DRIZZLE } from "../../drizzle/drizzle.module";
import { DrizzleDB } from "../../drizzle/types/drizzle";
import { RidderTable } from "../../drizzle/schema/ridder.schema";
import { eq } from "drizzle-orm";
import { ClientInvalidTokenException, ClientTokenExpiredException } from "../../exceptions";

@Injectable()
export class JwtRidderStrategy extends PassportStrategy(
    Strategy,
    'jwt-ridder',
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
            id: RidderTable.id,
            userName: RidderTable.userName,
            email: RidderTable.userName, 
            accessToken: RidderTable.accessToken, 
        }).from(RidderTable)
          .where(eq(RidderTable.id, payload.sub))
          .limit(1);
        if (!user || user.length === 0) {
            throw ClientInvalidTokenException;
        }
        
        const userDate = user[0];
        const currentToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        if (currentToken !== userDate.accessToken) {
            throw ClientTokenExpiredException;
        }

        delete userDate.accessToken;

        return userDate;
    }
}

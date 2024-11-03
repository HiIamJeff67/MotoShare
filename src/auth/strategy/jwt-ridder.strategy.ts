import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { DRIZZLE } from "../../drizzle/drizzle.module";
import { DrizzleDB } from "../../drizzle/types/drizzle";
import { RidderTable } from "../../drizzle/schema/ridder.schema";
import { eq } from "drizzle-orm";

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
        })
    }

    async validate(
        payload: {  // since we use id + email to generate the token
            sub: string,
            email: string,
        }
    ) {
        const user = await this.db.select({
            id: RidderTable.id,
            userName: RidderTable.userName,
            email: RidderTable.userName,
        }).from(RidderTable)
          .where(eq(RidderTable.id, payload.sub))
          .limit(1);

        return user;
    }
}

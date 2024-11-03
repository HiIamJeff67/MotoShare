import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { DrizzleModule } from "../../src/drizzle/drizzle.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtPassengerStrategy, JwtRidderStrategy } from "./strategy";

@Module({
    imports: [DrizzleModule, JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, JwtPassengerStrategy, JwtRidderStrategy],
})

export class AuthModule {}
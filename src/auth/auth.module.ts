import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategy/jwt-passenger.strategy";

@Module({
    imports: [DrizzleModule, JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})

export class AuthModule {}
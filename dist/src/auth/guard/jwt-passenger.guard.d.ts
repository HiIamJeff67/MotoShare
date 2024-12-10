import { ExecutionContext } from "@nestjs/common";
declare const JwtPassengerGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtPassengerGuard extends JwtPassengerGuard_base {
    constructor();
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export {};

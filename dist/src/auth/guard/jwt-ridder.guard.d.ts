import { ExecutionContext } from "@nestjs/common";
declare const JwtRidderGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtRidderGuard extends JwtRidderGuard_base {
    constructor();
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export {};

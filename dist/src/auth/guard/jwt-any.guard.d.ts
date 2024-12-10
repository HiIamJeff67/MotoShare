import { CanActivate, ExecutionContext, Type } from '@nestjs/common';
export declare class AnyGuard implements CanActivate {
    private readonly guardTypes;
    constructor(guardTypes: Type<CanActivate>[]);
    canActivate(context: ExecutionContext): Promise<boolean>;
}

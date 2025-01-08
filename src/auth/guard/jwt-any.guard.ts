import { CanActivate, ExecutionContext, Injectable, Type } from '@nestjs/common';

@Injectable()
export class AnyGuard implements CanActivate {
  constructor(private readonly guardTypes: Type<CanActivate>[]) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    for (const guardType of this.guardTypes) {
        const guard = new guardType();
        const result = await guard.canActivate(context);
        
        if (result) {
          return true;
        }
    }
    return false;
  }
}
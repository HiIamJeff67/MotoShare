import { CanActivate, ExecutionContext, Injectable, Type } from '@nestjs/common';

@Injectable()
export class AnyGuard implements CanActivate {
  constructor(private readonly guardTypes: Type<CanActivate>[]) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    for (const guardType of this.guardTypes) {
      const guard = new guardType();
      
      if (await guard.canActivate(context)) {
        return true;
      }
    }
    return false;
  }
}
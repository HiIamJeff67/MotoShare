import { UnauthorizedException } from '@nestjs/common';

export function CronAuth() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;    // store the function(original method) which is under this decorator
                                                // we can continue the original method only if we pass the authentication

    descriptor.value = async function (...args: any[]) {    // switch to authenticate logic
      const context = args[args.length - 2]; // ExecutionContext
      const request = context
        .switchToHttp()
        .getRequest();
      
      const authHeader = request.headers['authorization'];
      
      if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        throw new UnauthorizedException('Invalid authorization');
      }
      
      return originalMethod.apply(this, args);  // if all authentication pass, using default js function
    };

    return descriptor;
  };
}
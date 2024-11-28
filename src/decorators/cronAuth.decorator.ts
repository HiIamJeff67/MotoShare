import { UnauthorizedException } from '@nestjs/common';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export function CronAuth() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (
        request: VercelRequest, 
        response: VercelResponse, 
        ...args: any[]
    ) {
        const authHeader = Array.isArray(request.headers.authorization)
          ? request.headers.authorization[0]
          : request.headers.authorization;

        if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return response.status(401).json({ 
                success: false,
                message: 'Unauthorized' 
            });
        }

        return originalMethod.apply(this, [request, response, ...args]);
    };

    return descriptor;
  };
}
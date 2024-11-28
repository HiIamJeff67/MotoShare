"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronAuth = CronAuth;
function CronAuth() {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (request, response, ...args) {
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
//# sourceMappingURL=cronAuth.decorator.js.map
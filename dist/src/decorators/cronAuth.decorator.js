"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronAuth = CronAuth;
const common_1 = require("@nestjs/common");
function CronAuth() {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            const context = args[args.length - 2];
            const request = context
                .switchToHttp()
                .getRequest();
            const authHeader = request.headers['authorization'];
            if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
                throw new common_1.UnauthorizedException('Invalid authorization');
            }
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}
//# sourceMappingURL=cronAuth.decorator.js.map
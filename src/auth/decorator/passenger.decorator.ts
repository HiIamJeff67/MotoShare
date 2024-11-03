import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { TokenExpiredError } from "@nestjs/jwt";

export const Passenger = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request: Express.Request = ctx
            .switchToHttp()
            .getRequest();
        if (!request || !request.user) {
            throw new TokenExpiredError(
                'The access token has expired, please try to login again', 
                new Date()
            );
        }
        return request.user;
    }
)
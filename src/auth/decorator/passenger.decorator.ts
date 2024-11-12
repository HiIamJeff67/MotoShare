import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ClientInvalidTokenOrTokenExpiredException } from "../../exceptions";

export const Passenger = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request: Express.Request = ctx
            .switchToHttp()
            .getRequest();
        if (!request || !request.user) {
            throw ClientInvalidTokenOrTokenExpiredException;
        }
        return request.user;
    }
)
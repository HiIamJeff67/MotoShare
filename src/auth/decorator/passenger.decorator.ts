import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ClientInvalidTokenException } from "../../exceptions";

export const Passenger = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request: Express.Request = ctx
            .switchToHttp()
            .getRequest();
        if (!request || !request.user) {
            throw ClientInvalidTokenException;
        }
        return request.user;
    }
)
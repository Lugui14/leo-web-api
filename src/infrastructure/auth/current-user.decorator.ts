import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { RequestProps } from "./current-user.dto";
import { PersonPropsDto } from "@/domain/club/entities/person";

export const CurrentUser = createParamDecorator((_: unknown, ctx: ExecutionContext): PersonPropsDto => {
    const request: RequestProps = ctx.switchToHttp().getRequest();
    return request.user;
});

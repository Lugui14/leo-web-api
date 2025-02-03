import { RefreshUseCase } from "@/domain/club/use-cases/refresh";
import { Body, Controller, Get, HttpCode, Post, UsePipes } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { Roles } from "@/infrastructure/auth/roles.decorator";
import { RoleEnum } from "@/domain/club/entities/enums/role";
import { Public } from "@/infrastructure/auth/public";

const refreshBodySchema = z.object({
    refresh_token: z.string().min(1),
});

type RefreshBody = z.infer<typeof refreshBodySchema>;

@Controller("refresh")
export class RefreshController {
    constructor(private refreshUseCase: RefreshUseCase) {}

    @Post()
    @HttpCode(200)
    @Public()
    @UsePipes(new ZodValidationPipe(refreshBodySchema))
    async handle(@Body() body: RefreshBody) {
        return await this.refreshUseCase.execute(body.refresh_token);
    }

    @Get("/test")
    @Roles(RoleEnum.ASSOCIATED)
    test() {
        return "ASSOCIATED";
    }

    @Get("/test2")
    @Roles(RoleEnum.PRE_LEO)
    test2() {
        return "PRE_LEO";
    }
}

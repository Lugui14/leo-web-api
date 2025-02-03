import { AuthenticateUseCase } from "@/domain/club/use-cases/authenticate";
import { Body, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { Roles } from "@/infrastructure/auth/roles.decorator";
import { Public } from "@/infrastructure/auth/public";

const authenticateBodySchema = z.object({
    email: z.string().email().min(1),
    password: z.string().min(6),
});

type AuthenticateBody = z.infer<typeof authenticateBodySchema>;

@Controller("authenticate")
export class AuthenticateController {
    constructor(private authenticateUseCase: AuthenticateUseCase) {}

    @Post()
    @Public()
    @HttpCode(200)
    @Roles()
    @UsePipes(new ZodValidationPipe(authenticateBodySchema))
    async handle(@Body() body: AuthenticateBody) {
        return await this.authenticateUseCase.execute(body);
    }
}

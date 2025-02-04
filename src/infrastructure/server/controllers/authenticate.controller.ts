import { AuthenticateUseCase, AuthenticateUseCaseResponse } from "@/domain/club/use-cases/authenticate";
import { Body, Controller, HttpCode, HttpException, Post, UsePipes } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { Roles } from "@/infrastructure/auth/roles.decorator";
import { Public } from "@/infrastructure/auth/public";
import { InvalidPasswordError } from "@/domain/club/use-cases/errors/invalid-password";
import { PersonNotFoundError } from "@/domain/club/use-cases/errors/person-not-found";

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
        const result = await this.authenticateUseCase.execute(body);

        return result.fold(
            (error: InvalidPasswordError | PersonNotFoundError) => {
                throw new HttpException(error.message, error.getStatus());
            },
            (response: AuthenticateUseCaseResponse) => response,
        );
    }
}

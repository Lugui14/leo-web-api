import { ChangePasswordUseCase } from "@/domain/club/use-cases/change-password";
import { Body, Controller, HttpCode, HttpException, Post, UsePipes } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { Roles } from "@/infrastructure/auth/roles.decorator";
import { ForbiddenPersonNotFoundError } from "@/domain/club/use-cases/errors/person-not-found";
import { InvalidPasswordError } from "@/domain/club/use-cases/errors/invalid-password";
import { Person } from "@/domain/club/entities/person";
import { PersonPresenter } from "../presenter/person-presenter";

const changePasswordBodySchema = z.object({
    personId: z.string().min(1),
    oldPassword: z.string().min(1),
    newPassword: z.string().min(1),
});

type ChangePasswordBody = z.infer<typeof changePasswordBodySchema>;

@Controller("change-password")
export class ChangePasswordController {
    constructor(private ChangePasswordUseCase: ChangePasswordUseCase) {}

    @Post()
    @HttpCode(200)
    @Roles()
    @UsePipes(new ZodValidationPipe(changePasswordBodySchema))
    async handle(@Body() body: ChangePasswordBody) {
        const result = await this.ChangePasswordUseCase.execute(body);

        return result.fold(
            (error: InvalidPasswordError | ForbiddenPersonNotFoundError) => {
                throw new HttpException(error.message, error.getStatus());
            },
            (person: Person) => PersonPresenter.toHttp(person),
        );
    }
}

import { SignUpUseCase } from "@/domain/club/use-cases/signup";
import { Body, Controller, HttpCode, HttpException, HttpStatus, Post, UsePipes } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { Person } from "@/domain/club/entities/person";
import { Public } from "@/infrastructure/auth/public";
import { PersonAlreadyExists } from "@/domain/club/use-cases/errors/person-already-exists";
import { PersonPresenter } from "../presenter/person-presenter";

const signUpBodySchema = z.object({
    name: z.string().min(1),
    email: z.string().email().min(1),
    cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
    birthdate: z.string().date(),
    password: z.string().min(6),
});

type signUpBody = z.infer<typeof signUpBodySchema>;

@Controller("signup")
export class SignupController {
    constructor(private signUpUseCase: SignUpUseCase) {}

    @Post()
    @Public()
    @HttpCode(201)
    @UsePipes(new ZodValidationPipe(signUpBodySchema))
    async handle(@Body() body: signUpBody) {
        const result = await this.signUpUseCase.execute(body);

        return result.fold(
            (error: PersonAlreadyExists) => {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
            },
            (person: Person) => PersonPresenter.toHttp(person),
        );
    }
}

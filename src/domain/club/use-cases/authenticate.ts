import { PersonRepository } from "../repositories/person-repository";
import { InvalidPasswordError } from "./errors/invalid-password";
import { PersonNotFoundError } from "./errors/person-not-found";
import { Either, left, right } from "@/core/either";
import { HashComparer } from "../cryptography/hash-comparer";
import { JWTPayloadProps } from "@/infrastructure/auth/current-user.dto";
import { Injectable } from "@nestjs/common";
import { Encrypter } from "../cryptography/encrypter";

interface AuthenticateUseCaseProps {
    email: string;
    password: string;
}

export interface AuthenticateUseCaseResponse {
    accessToken: string;
    refreshToken: string;
}

@Injectable()
export class AuthenticateUseCase {
    constructor(
        private personRepository: PersonRepository,
        private hashComparer: HashComparer,
        private jwtEncrypter: Encrypter,
    ) {}

    async execute({
        email,
        password,
    }: AuthenticateUseCaseProps): Promise<
        Either<InvalidPasswordError | PersonNotFoundError, AuthenticateUseCaseResponse>
    > {
        const person = await this.personRepository.findByEmail(email);
        if (!person) {
            return left(new PersonNotFoundError());
        }

        const isPasswordValid = await this.hashComparer.compare(password, person.password);

        if (!isPasswordValid) {
            return left(new InvalidPasswordError());
        }

        const payload: Omit<JWTPayloadProps, "type"> = {
            sub: person.id,
            email: person.email.value,
            roles: person.roles.map((role) => role.name),
        };

        const accessToken = this.jwtEncrypter.encrypt({ ...payload, type: "access_token" }, "1h");
        const refreshToken = this.jwtEncrypter.encrypt({ ...payload, type: "refresh_token" }, "1d");

        person.refreshToken = refreshToken;
        await this.personRepository.update(person);

        return right({ accessToken, refreshToken });
    }
}

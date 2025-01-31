import { JwtEncrypter } from "@/infrastructure/cryptography/jwt-encrypter";
import { PersonRepository } from "../repositories/person-repository";
import { InvalidPasswordError } from "./errors/invalid-password";
import { PersonNotFoundError } from "./errors/person-not-found";
import { Either, left, right } from "@/core/either";
import { HashComparer } from "../cryptography/hash-comparer";

export class AuthenticateUseCase {
    constructor(
        private personRepository: PersonRepository,
        private hashComparer: HashComparer,
        private jwtEncrypter: JwtEncrypter,
    ) {}

    async execute(
        email: string,
        password: string,
    ): Promise<Either<InvalidPasswordError | PersonNotFoundError, string>> {
        const person = await this.personRepository.findByEmail(email);
        if (!person) {
            return left(new PersonNotFoundError());
        }

        const isPasswordValid = await this.hashComparer.compare(password, person.password);

        if (!isPasswordValid) {
            return left(new InvalidPasswordError());
        }

        const refreshToken = this.jwtEncrypter.encrypt({ id: person.id, email: person.email.value }, "7d");

        person.refreshToken = refreshToken;
        await this.personRepository.save(person);

        return right(refreshToken);
    }
}

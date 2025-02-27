import { PersonRepository } from "../repositories/person-repository";
import { Injectable } from "@nestjs/common";
import { HashGenerator } from "../cryptography/hash-generator";
import { Either, left, right } from "@/core/either";
import { Person } from "../entities/person";
import { ForbiddenPersonNotFoundError } from "./errors/person-not-found";
import { HashComparer } from "../cryptography/hash-comparer";
import { InvalidPasswordError } from "./errors/invalid-password";

interface ChangePasswordUseCaseProps {
    personId: string;
    oldPassword: string;
    newPassword: string;
}

@Injectable()
export class ChangePasswordUseCase {
    constructor(
        private personRepository: PersonRepository,
        private hashGenerator: HashGenerator,
        private hashComparer: HashComparer,
    ) {}

    async execute({
        personId,
        oldPassword,
        newPassword,
    }: ChangePasswordUseCaseProps): Promise<Either<ForbiddenPersonNotFoundError, Person>> {
        const person = await this.personRepository.findById(personId);

        if (!person) {
            return left(new ForbiddenPersonNotFoundError());
        }

        const isOldPasswordValid = await this.hashComparer.compare(oldPassword, person.password);

        if (!isOldPasswordValid) {
            return left(new InvalidPasswordError());
        }

        const hashedPassword = await this.hashGenerator.generateHash(newPassword);

        person.password = hashedPassword;

        const savedPerson = await this.personRepository.update(person);

        return right(savedPerson);
    }
}

import { PersonRepository } from "../repositories/person-repository";
import { Person } from "../entities/person";
import { Email } from "../entities/value-objects/email";
import { CPF } from "../entities/value-objects/cpf";
import { genSaltSync, hashSync } from "bcrypt";
import { Role } from "../entities/role";
import { RoleEnum } from "../entities/enums/role";
import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { PersonAlreadyExists } from "./errors/person-already-exists";

interface SignUpUseCaseProps {
    name: string;
    email: string;
    cpf: string;
    birthdate: string;
    password: string;
}

@Injectable()
export class SignUpUseCase {
    constructor(private personRepository: PersonRepository) {}

    async execute({
        name,
        email,
        cpf,
        birthdate,
        password,
    }: SignUpUseCaseProps): Promise<Either<PersonAlreadyExists, Person>> {
        const salt = genSaltSync(12);
        const hashedPassword = hashSync(password, salt);

        const personAlreadyExists = await this.personRepository.findByEmail(email);
        if (personAlreadyExists) return left(new PersonAlreadyExists());

        const person = Person.create({
            name,
            email: new Email(email),
            cpf: new CPF(cpf),
            birthdate: new Date(birthdate),
            password: hashedPassword,
            roles: [Role.create({ name: RoleEnum.PRE_LEO })],
            monthlyFees: [],
        });

        await this.personRepository.save(person);

        return right(person);
    }
}

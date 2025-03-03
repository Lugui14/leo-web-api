import { HashGenerator } from "@/domain/club/cryptography/hash-generator";
import { PersonRepository } from "../repositories/person-repository";
import { Person } from "../entities/person";
import { Email } from "../entities/value-objects/email";
import { CPF } from "../entities/value-objects/cpf";
import { RoleEnum } from "../entities/enums/role";
import { Injectable } from "@nestjs/common";
import { Either, left, right } from "@/core/either";
import { PersonAlreadyExists } from "./errors/person-already-exists";
import { MonthlyFeeList } from "../entities/monthly-fee-list";
import { MonthlyFee } from "../entities/monthly-fee";

interface SignUpUseCaseProps {
    name: string;
    email: string;
    cpf: string;
    birthdate: string;
    password: string;
}

@Injectable()
export class SignUpUseCase {
    constructor(
        private personRepository: PersonRepository,
        private hashGenerator: HashGenerator,
    ) {}

    async execute({
        name,
        email,
        cpf,
        birthdate,
        password,
    }: SignUpUseCaseProps): Promise<Either<PersonAlreadyExists, Person>> {
        const hashedPassword = await this.hashGenerator.generateHash(password);

        const personAlreadyExists = await this.personRepository.findByEmail(email);
        if (personAlreadyExists) return left(new PersonAlreadyExists());

        const monthlyFeeList = new MonthlyFeeList();

        const actualDate = new Date();

        for (let i = 1; i <= 12; i++) {
            monthlyFeeList.add(
                MonthlyFee.create({
                    value: 30,
                    dueDate: new Date(actualDate.getFullYear(), i, 1),
                    status: "PENDING",
                }),
            );
        }

        const person = Person.create({
            name,
            email: new Email(email),
            cpf: new CPF(cpf),
            birthdate: new Date(birthdate),
            password: hashedPassword,
            roles: [RoleEnum.PRE_LEO],
            monthlyFees: monthlyFeeList,
        });

        await this.personRepository.save(person);

        return right(person);
    }
}

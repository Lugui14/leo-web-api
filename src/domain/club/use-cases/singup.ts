import { PersonRepository } from "../repositories/person-repository";
import { Role } from "../entities/enums/role";
import { Person } from "../entities/person";
import { Email } from "../entities/value-objects/email";
import { CPF } from "../entities/value-objects/cpf";
import { genSaltSync, hashSync } from "bcrypt";

export class SignUpUseCase {
    constructor(private personRepository: PersonRepository) {}

    async execute(
        name: string,
        email: string,
        cpf: string,
        birthdate: Date,
        password: string,
        role: Role,
    ): Promise<Person> {
        const salt = genSaltSync(12);
        const hashedPassword = hashSync(password, salt);

        const person = Person.create({
            name,
            email: new Email(email),
            cpf: new CPF(cpf),
            birthdate,
            password: hashedPassword,
            salt,
            role,
            monthlyFees: [],
        });

        await this.personRepository.save(person);

        return person;
    }
}

import { Person } from "@/domain/club/entities/person";
import { CPF } from "@/domain/club/entities/value-objects/cpf";
import { Email } from "@/domain/club/entities/value-objects/email";
import { PrismaPersonMapper } from "@/infrastructure/database/mappers/prisma-person-mapper";
import { PrismaService } from "@/infrastructure/database/prisma.service";
import { Injectable } from "@nestjs/common";
import { faker } from "@faker-js/faker";

export function makePerson(overrides: Partial<Person> = {}): Person {
    return Person.create({
        name: faker.person.fullName(),
        email: new Email(faker.internet.email()),
        password: "123456",
        birthdate: new Date("1999-01-01"),
        cpf: new CPF("335.038.740-38"),
        roles: [],
        monthlyFees: [],
        ...overrides,
    });
}

@Injectable()
export class PersonFactory {
    constructor(private prisma: PrismaService) {}

    async makePrismaPerson(data: Partial<Person> = {}): Promise<Person> {
        const person = makePerson(data);

        const savedPerson = await this.prisma.person.create({
            data: PrismaPersonMapper.toPersistence(person),
        });

        return PrismaPersonMapper.toEntity(savedPerson);
    }
}

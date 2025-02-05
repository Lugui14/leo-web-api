import { Person } from "@/domain/club/entities/person";
import { CPF } from "@/domain/club/entities/value-objects/cpf";
import { Email } from "@/domain/club/entities/value-objects/email";
import { PrismaPersonMapper } from "@/infrastructure/database/mappers/prisma-person-mapper";
import { PrismaService } from "@/infrastructure/database/prisma.service";
import { Injectable } from "@nestjs/common";

export function makePerson(overrides: Partial<Person> = {}): Person {
    return Person.create({
        name: "Test",
        email: new Email("test@test.com"),
        password: "123456",
        birthdate: new Date("1999-01-01"),
        cpf: new CPF("03.124.220-32"),
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

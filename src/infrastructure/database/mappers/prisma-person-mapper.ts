import { Person } from "@/domain/club/entities/person";
import { CPF } from "@/domain/club/entities/value-objects/cpf";
import { Email } from "@/domain/club/entities/value-objects/email";
import { Prisma, Person as PrismaPerson } from "@prisma/client";

export class PrismaPersonMapper {
    static toEntity = (person: PrismaPerson): Person => {
        return Person.create(
            {
                name: person.name,
                email: new Email(person.email),
                cpf: new CPF(person.cpf),
                birthdate: person.birthdate,
                password: person.password,
                refreshToken: person.refreshToken || undefined,
                roles: [],
                monthlyFees: [],
                clubId: person.clubId || undefined,
            },
            person.id,
        );
    };

    static toPersistence = (person: Person): Prisma.PersonCreateInput => {
        return {
            id: person.id,
            name: person.name,
            email: person.email.value,
            cpf: person.cpf.value,
            birthdate: person.birthdate,
            password: person.password,
            refreshToken: person.refreshToken || null,
            roles: {
                connect: person.roles.map((role) => ({ id: role.id })),
            },
            monthlyFees: {
                create: person.monthlyFees.map((fee) => ({
                    value: fee.value,
                    dueDate: fee.dueDate,
                    status: fee.status,
                })),
            },
            club:
                person.clubId ?
                    {
                        connect: { id: person.clubId },
                    }
                :   undefined,
        };
    };
}

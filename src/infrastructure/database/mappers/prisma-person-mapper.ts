import { RoleEnum } from "@/domain/club/entities/enums/role";
import { MonthlyFeeList } from "@/domain/club/entities/monthly-fee-list";
import { Person } from "@/domain/club/entities/person";
import { CPF } from "@/domain/club/entities/value-objects/cpf";
import { Email } from "@/domain/club/entities/value-objects/email";
import { Prisma, Person as PrismaPerson, Role as PrismaRole } from "@prisma/client";

type PrismaRoles = {
    roles?: PrismaRole[];
};

type PrismaPersonWithRoles = PrismaPerson & PrismaRoles;

export class PrismaPersonMapper {
    static toEntity = (person: PrismaPersonWithRoles): Person => {
        return Person.create(
            {
                name: person.name,
                email: new Email(person.email),
                cpf: new CPF(person.cpf),
                birthdate: person.birthdate,
                password: person.password,
                refreshToken: person.refreshToken || undefined,
                roles: person.roles ? person.roles.map((role) => role.name as RoleEnum) : [],
                monthlyFees: new MonthlyFeeList(),
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
                connect: person.roles.map((role) => ({ name: role })),
            },
            monthlyFees: {
                create: person.monthlyFees.getItems().map((fee) => ({
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

import { Person } from "@/domain/club/entities/person";
import { PersonRepository } from "@/domain/club/repositories/person-repository";
import { PrismaService } from "../prisma.service";
import { PrismaPersonMapper } from "../mappers/prisma-person-mapper";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaPersonRepository implements PersonRepository {
    constructor(private prisma: PrismaService) {}

    async save(person: Person): Promise<Person> {
        const prismaPerson = await this.prisma.person.create({
            data: PrismaPersonMapper.toPersistence(person),
        });

        return PrismaPersonMapper.toEntity(prismaPerson);
    }

    async findByEmail(email: string): Promise<Person | null> {
        const prismaPerson = await this.prisma.person.findUnique({
            where: { email },
            include: { roles: true },
        });

        return prismaPerson ? PrismaPersonMapper.toEntity(prismaPerson) : null;
    }

    async findByClubId(clubId: string): Promise<Person[] | null> {
        const prismaPersons = await this.prisma.person.findMany({
            where: { clubId },
            include: { roles: true },
        });

        return prismaPersons.map((prismaPerson) => PrismaPersonMapper.toEntity(prismaPerson));
    }

    async findById(id: string): Promise<Person | null> {
        const prismaPerson = await this.prisma.person.findUnique({
            where: { id },
            include: { roles: true },
        });

        return prismaPerson ? PrismaPersonMapper.toEntity(prismaPerson) : null;
    }

    async update(person: Person): Promise<Person> {
        const prismaPerson = await this.prisma.person.update({
            where: { id: person.id },
            data: PrismaPersonMapper.toPersistence(person),
        });

        return PrismaPersonMapper.toEntity(prismaPerson);
    }
}

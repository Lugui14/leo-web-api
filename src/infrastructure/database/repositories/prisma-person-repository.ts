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
        });

        return prismaPerson ? PrismaPersonMapper.toEntity(prismaPerson) : null;
    }

    async findById(id: string): Promise<Person | null> {
        const prismaPerson = await this.prisma.person.findUnique({
            where: { id },
        });

        return prismaPerson ? PrismaPersonMapper.toEntity(prismaPerson) : null;
    }
}

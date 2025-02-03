import { Club } from "@/domain/club/entities/club";
import { ClubRepository } from "@/domain/club/repositories/club-repository";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaClubMapper } from "../mappers/prisma-club-mapper";

@Injectable()
export class PrismaClubRepository implements ClubRepository {
    constructor(private prisma: PrismaService) {}

    async save(club: Club): Promise<Club> {
        const prismaClub = await this.prisma.club.create({
            data: PrismaClubMapper.toPersistence(club),
        });

        return PrismaClubMapper.toEntity(prismaClub);
    }
    async findById(id: string): Promise<Club | null> {
        const prismaClub = await this.prisma.club.findUnique({
            where: {
                id,
            },
        });

        return prismaClub ? PrismaClubMapper.toEntity(prismaClub) : null;
    }

    async findAll(): Promise<Club[]> {
        const prismaClubs = await this.prisma.club.findMany();

        return prismaClubs.map((prismaClub) => PrismaClubMapper.toEntity(prismaClub));
    }
}

import { Club } from "@/domain/club/entities/club";
import { Prisma, Club as PrismaClub } from "@prisma/client";

export class PrismaClubMapper {
    static toEntity(club: PrismaClub): Club {
        return Club.create(
            {
                name: club.name,
                persons: [],
            },
            club.id,
        );
    }

    static toPersistence(club: Club): Prisma.ClubCreateInput {
        return {
            id: club.id,
            name: club.name,
        };
    }
}

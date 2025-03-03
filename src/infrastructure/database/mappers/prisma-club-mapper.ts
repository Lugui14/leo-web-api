import { Club } from "@/domain/club/entities/club";
import { ClubPersonList } from "@/domain/club/entities/club-person-list";
import { CNPJ } from "@/domain/club/entities/value-objects/cnpj";
import { Prisma, Club as PrismaClub } from "@prisma/client";

export class PrismaClubMapper {
    static toEntity(club: PrismaClub): Club {
        return Club.create(
            {
                name: club.name,
                cnpj: new CNPJ(club.cnpj),
                persons: new ClubPersonList(),
            },
            club.id,
        );
    }

    static toPersistence(club: Club): Prisma.ClubCreateInput {
        return {
            id: club.id,
            name: club.name,
            cnpj: club.cnpj.value,
        };
    }
}

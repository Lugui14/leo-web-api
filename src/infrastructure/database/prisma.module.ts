import { ClubRepository } from "@/domain/club/repositories/club-repository";
import { PersonRepository } from "@/domain/club/repositories/person-repository";
import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { PrismaClubRepository } from "./repositories/prisma-club-repository";
import { PrismaPersonRepository } from "./repositories/prisma-person-repository";

@Global()
@Module({
    providers: [
        PrismaService,
        {
            provide: ClubRepository,
            useClass: PrismaClubRepository,
        },
        {
            provide: PersonRepository,
            useClass: PrismaPersonRepository,
        },
    ],
    exports: [PrismaService, ClubRepository, PersonRepository],
})
export class PrismaModule {}

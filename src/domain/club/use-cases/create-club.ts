import { CNPJ } from "./../entities/value-objects/cnpj";
import { Injectable } from "@nestjs/common";
import { ClubRepository } from "../repositories/club-repository";
import { PersonRepository } from "../repositories/person-repository";
import { Club } from "../entities/club";
import { Either, left, right } from "@/core/either";
import { PersonNotFoundError } from "./errors/person-not-found";

interface CreateClubProps {
    name: string;
    cnpj: string;
    presidentId: string;
}

@Injectable()
export class CreateClubUseCase {
    constructor(
        private clubRepository: ClubRepository,
        private personRepository: PersonRepository,
    ) {}

    async execute({ name, cnpj, presidentId }: CreateClubProps): Promise<Either<PersonNotFoundError, Club>> {
        const president = await this.personRepository.findById(presidentId);

        if (!president) return left(new PersonNotFoundError());

        const club = Club.create({ name, cnpj: new CNPJ(cnpj), persons: [president] });

        const savedClub = await this.clubRepository.save(club);

        return right(savedClub);
    }
}

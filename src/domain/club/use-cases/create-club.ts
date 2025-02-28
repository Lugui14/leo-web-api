import { CNPJ } from "./../entities/value-objects/cnpj";
import { Injectable } from "@nestjs/common";
import { ClubRepository } from "../repositories/club-repository";
import { PersonRepository } from "../repositories/person-repository";
import { Club } from "../entities/club";
import { Either, left, right } from "@/core/either";
import { PersonNotFoundError } from "./errors/person-not-found";
import { RoleEnum } from "../entities/enums/role";

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

        const club = Club.create({ name, cnpj: new CNPJ(cnpj), persons: [] });
        club.addPerson(president);

        const savedClub = await this.clubRepository.save(club);
        const savedPresident = savedClub.persons.find((person) => person.id === presidentId);

        if (!savedPresident) return left(new PersonNotFoundError());

        savedPresident.roles.push(RoleEnum.PRESIDENT);

        await this.personRepository.update(savedPresident);

        return right(savedClub);
    }
}

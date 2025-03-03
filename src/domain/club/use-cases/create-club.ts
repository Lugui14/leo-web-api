import { CNPJ } from "./../entities/value-objects/cnpj";
import { Injectable } from "@nestjs/common";
import { ClubRepository } from "../repositories/club-repository";
import { PersonRepository } from "../repositories/person-repository";
import { Club } from "../entities/club";
import { Either, left, right } from "@/core/either";
import { PersonNotFoundError } from "./errors/person-not-found";
import { RoleEnum } from "../entities/enums/role";
import { ClubPersonList } from "../entities/club-person-list";

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

        const club = Club.create({ name, cnpj: new CNPJ(cnpj), persons: new ClubPersonList() });
        club.addPerson(president);

        const savedClub = await this.clubRepository.save(club);
        const savedPresident = savedClub.persons.getItems().find((person) => person.id === presidentId);

        if (!savedPresident) return left(new PersonNotFoundError());

        savedPresident.roles.push(RoleEnum.PRESIDENT);

        await this.personRepository.update(savedPresident);

        return right(savedClub);
    }
}

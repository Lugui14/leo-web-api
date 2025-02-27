import { PersonRepository } from "@/domain/club/repositories/person-repository";
import { Injectable } from "@nestjs/common";
import { ClubRepository } from "../repositories/club-repository";
import { Either, left, right } from "@/core/either";
import { Club } from "../entities/club";
import { PersonNotFoundError } from "./errors/person-not-found";
import { ClubNotFoundError } from "./errors/club-not-found";

interface AddPersonToClubProps {
    personId: string;
    clubId: string;
}

@Injectable()
export class AddPersonToClubUseCase {
    constructor(
        private personRepository: PersonRepository,
        private clubRepository: ClubRepository,
    ) {}

    async execute({
        personId,
        clubId,
    }: AddPersonToClubProps): Promise<Either<PersonNotFoundError | ClubNotFoundError, Club>> {
        const person = await this.personRepository.findById(personId);
        if (!person) return left(new PersonNotFoundError());

        const club = await this.clubRepository.findById(clubId);
        if (!club) return left(new ClubNotFoundError());

        club.addPerson(person);

        await this.clubRepository.update(club);

        return right(club);
    }
}

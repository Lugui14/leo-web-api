import { Either, left, right } from "@/core/either";
import { PersonRepository } from "@/domain/club/repositories/person-repository";
import { Injectable } from "@nestjs/common";
import { Person } from "../entities/person";
import { PersonNotFoundError } from "./errors/person-not-found";
import { RoleEnum } from "../entities/enums/role";
import { PersonNotInAClubError } from "./errors/person-not-in-a-club";

@Injectable()
export class AssociatePersonUseCase {
    constructor(private personRepository: PersonRepository) {}

    async execute(personId: string): Promise<Either<PersonNotFoundError | PersonNotInAClubError, Person>> {
        const person = await this.personRepository.findById(personId);

        if (!person) return left(new PersonNotFoundError());

        if (!person.clubId) return left(new PersonNotInAClubError());

        const newRoles = [...person.roles.filter((role) => role !== RoleEnum.PRE_LEO), RoleEnum.ASSOCIATED];
        person.roles = newRoles;

        const updatedPerson = await this.personRepository.update(person);
        return right(updatedPerson);
    }
}

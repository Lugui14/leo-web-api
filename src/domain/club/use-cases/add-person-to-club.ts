import { PersonRepository } from "@/domain/club/repositories/person-repository";
import { Injectable } from "@nestjs/common";
import { ClubRepository } from "../repositories/club-repository";

@Injectable()
export class AddPersonToClubUseCase {
    constructor(
        private personRepository: PersonRepository,
        private clubRepository: ClubRepository,
    ) {}

    async execute(): Promise<void> {}
}

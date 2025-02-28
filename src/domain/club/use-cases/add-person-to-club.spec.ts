import { InMemoryPersonRepository } from "@/../test/repositories/in-memory-person-repository";
import { InMemoryClubRepository } from "@/../test/repositories/in-memory-club-repository";
import { FakeHashGenerator } from "@/../test/cryptography/fake-hash-generator";
import { AddPersonToClubUseCase } from "./add-person-to-club";
import { Person } from "../entities/person";
import { Club } from "../entities/club";
import { Email } from "../entities/value-objects/email";
import { CPF } from "../entities/value-objects/cpf";
import { CNPJ } from "../entities/value-objects/cnpj";
import { PersonNotFoundError } from "./errors/person-not-found";
import { ClubNotFoundError } from "./errors/club-not-found";

describe("Add person to club use case tests", () => {
    const mockPersonRepository = new InMemoryPersonRepository();
    const mockClubRepository = new InMemoryClubRepository();
    const mockHashGenerator = new FakeHashGenerator();

    const useCase = new AddPersonToClubUseCase(mockPersonRepository, mockClubRepository);

    let person: Person;
    let club: Club;

    beforeAll(async () => {
        person = await mockPersonRepository.save(
            Person.create({
                name: "Test",
                email: new Email("test@test.com"),
                password: await mockHashGenerator.generateHash("123456"),
                birthdate: new Date("1999-01-01"),
                cpf: new CPF("205.372.220-73"),
                roles: [],
                monthlyFees: [],
            }),
        );

        club = await mockClubRepository.save(
            Club.create({
                name: "ClubTest",
                cnpj: new CNPJ("86.809.487/0001-73"),
                persons: [],
            }),
        );
    });

    it("Should add a person to a club", async () => {
        const response = await useCase.execute({
            personId: person.id,
            clubId: club.id,
        });

        const savedClub = response.value as Club;

        expect(response.isRight()).toBeTruthy();
        expect(response.value).toBeInstanceOf(Club);
        expect(savedClub.id).toBe(club.id);
        expect(savedClub.persons.length).toBe(1);
    });

    it("Should return left person not found error", async () => {
        const response = await useCase.execute({
            personId: "123",
            clubId: club.id,
        });

        const personNotFoundError = response.value as PersonNotFoundError;

        expect(response.isLeft()).toBeTruthy();
        expect(response.value).toBeInstanceOf(PersonNotFoundError);

        expect(personNotFoundError.message).toBe("Person does not exists");
    });

    it("Should return left club not found error", async () => {
        const response = await useCase.execute({
            personId: person.id,
            clubId: "123",
        });

        const clubNotFoundError = response.value as ClubNotFoundError;

        expect(response.isLeft()).toBeTruthy();
        expect(response.value).toBeInstanceOf(ClubNotFoundError);

        expect(clubNotFoundError.message).toBe("Club does not exists");
    });
});

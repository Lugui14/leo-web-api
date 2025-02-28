import { InMemoryClubRepository } from "@/../test/repositories/in-memory-club-repository";
import { InMemoryPersonRepository } from "@/../test/repositories/in-memory-person-repository";
import { FakeHashGenerator } from "@/../test/cryptography/fake-hash-generator";
import { CreateClubUseCase } from "./create-club";
import { Person } from "../entities/person";
import { Email } from "../entities/value-objects/email";
import { CPF } from "../entities/value-objects/cpf";
import { Club } from "../entities/club";
import { RoleEnum } from "../entities/enums/role";
import { PersonNotFoundError } from "./errors/person-not-found";

describe("Create club use case tests", () => {
    const mockClubRepository = new InMemoryClubRepository();
    const mockPersonRepository = new InMemoryPersonRepository();
    const mockHashGenerator = new FakeHashGenerator();

    const useCase = new CreateClubUseCase(mockClubRepository, mockPersonRepository);

    let person: Person;

    beforeAll(async () => {
        person = await mockPersonRepository.save(
            Person.create({
                name: "Test",
                email: new Email("test@test.com"),
                password: await mockHashGenerator.generateHash("123456"),
                birthdate: new Date("1999-01-01"),
                cpf: new CPF("122.090.850-98"),
                roles: [],
                monthlyFees: [],
            }),
        );
    });

    it("Should create a club", async () => {
        const response = await useCase.execute({
            name: "Test Club",
            cnpj: "62.882.734/0001-07",
            presidentId: person.id,
        });

        const clubCreated = response.value as Club;

        expect(response.isRight()).toBeTruthy();
        expect(clubCreated).toBeInstanceOf(Club);
        expect(clubCreated.id).toBeDefined();
        expect(clubCreated.persons).toHaveLength(1);
        expect(clubCreated.persons[0].roles).toContain(RoleEnum.PRESIDENT);
    });

    it("Should not create a club if president does not exist", async () => {
        const response = await useCase.execute({
            name: "Test Club",
            cnpj: "62.882.734/0001-07",
            presidentId: "non-existing-id",
        });

        expect(response.isLeft()).toBeTruthy();
        expect(response.value).toBeInstanceOf(PersonNotFoundError);
    });
});

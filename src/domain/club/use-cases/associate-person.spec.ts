import { InMemoryPersonRepository } from "@/../test/repositories/in-memory-person-repository";
import { InMemoryClubRepository } from "@/../test/repositories/in-memory-club-repository";
import { FakeHashGenerator } from "@/../test/cryptography/fake-hash-generator";
import { Person } from "../entities/person";
import { Club } from "../entities/club";
import { Email } from "../entities/value-objects/email";
import { CPF } from "../entities/value-objects/cpf";
import { CNPJ } from "../entities/value-objects/cnpj";
import { AssociatePersonUseCase } from "./associate-person";
import { PersonNotFoundError } from "./errors/person-not-found";
import { RoleEnum } from "../entities/enums/role";
import { PersonNotInAClubError } from "./errors/person-not-in-a-club";
import { MonthlyFeeList } from "../entities/monthly-fee-list";
import { ClubPersonList } from "../entities/club-person-list";

describe("Add person to club use case tests", () => {
    const mockPersonRepository = new InMemoryPersonRepository();
    const mockClubRepository = new InMemoryClubRepository();
    const mockHashGenerator = new FakeHashGenerator();

    const useCase = new AssociatePersonUseCase(mockPersonRepository);

    let person: Person;

    beforeAll(async () => {
        person = await mockPersonRepository.save(
            Person.create({
                name: "Test",
                email: new Email("test@test.com"),
                password: await mockHashGenerator.generateHash("123456"),
                birthdate: new Date("1999-01-01"),
                cpf: new CPF("214.395.310-05"),
                roles: [RoleEnum.PRE_LEO],
                monthlyFees: new MonthlyFeeList(),
            }),
        );

        const savedClub = await mockClubRepository.save(
            Club.create({
                name: "Test",
                cnpj: new CNPJ("80.260.887/0001-96"),
                persons: new ClubPersonList(),
            }),
        );

        savedClub.addPerson(person);
        await mockClubRepository.update(savedClub);
        await mockPersonRepository.update(savedClub.persons.getItems()[0]);
    });

    it("Should associate a person", async () => {
        const response = await useCase.execute(person.id);

        const savedPerson = response.value as Person;

        expect(response.isRight()).toBeTruthy();
        expect(response.value).toBeInstanceOf(Person);
        expect(savedPerson.roles).toContain("ASSOCIATED");
        expect(savedPerson.roles).not.toContain("PRE_LEO");
    });

    it("Should return left person not found error", async () => {
        const response = await useCase.execute("123");

        expect(response.isLeft()).toBeTruthy();
        expect(response.value).toBeInstanceOf(PersonNotFoundError);
    });

    it("Should return left person not in a club error", async () => {
        const newPerson = await mockPersonRepository.save(
            Person.create({
                name: "Test1",
                email: new Email("test@test1.com"),
                password: await mockHashGenerator.generateHash("123456"),
                birthdate: new Date("1999-01-01"),
                cpf: new CPF("311.853.540-77"),
                roles: [RoleEnum.PRE_LEO],
                monthlyFees: new MonthlyFeeList(),
            }),
        );

        const response = await useCase.execute(newPerson.id);

        expect(response.isLeft()).toBeTruthy();
        expect(response.value).toBeInstanceOf(PersonNotInAClubError);
    });
});

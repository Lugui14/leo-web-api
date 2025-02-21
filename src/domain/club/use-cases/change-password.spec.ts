import { FakeHashComparer } from "@/../test/cryptography/fake-hash-comparer";
import { FakeHashGenerator } from "@/../test/cryptography/fake-hash-generator";
import { InMemoryPersonRepository } from "@/../test/repositories/in-memory-person-repository";
import { ChangePasswordUseCase } from "./change-password";
import { Person } from "../entities/person";
import { Email } from "../entities/value-objects/email";
import { CPF } from "../entities/value-objects/cpf";
import { PersonNotFoundError } from "./errors/person-not-found";
import { InvalidPasswordError } from "./errors/invalid-password";

describe("Change password use case tests", () => {
    const mockPersonRepository = new InMemoryPersonRepository();
    const mockHashComparer = new FakeHashComparer();
    const mockHashGenerator = new FakeHashGenerator();

    const useCase = new ChangePasswordUseCase(mockPersonRepository, mockHashGenerator, mockHashComparer);

    let person: Person;

    beforeAll(async () => {
        const person1 = Person.create({
            name: "Test",
            email: new Email("test@test.com"),
            password: await mockHashGenerator.generateHash("123456"),
            birthdate: new Date("1999-01-01"),
            cpf: new CPF("303.124.220-32"),
            roles: [],
            monthlyFees: [],
        });

        person = await mockPersonRepository.save(person1);
    });

    it("should change password", async () => {
        const response = await useCase.execute({
            personId: person.id,
            oldPassword: "123456",
            newPassword: "654321",
        });

        expect(response.isRight()).toBeTruthy();
        expect(response.value).toBeInstanceOf(Person);
    });

    it("should return person not found error", async () => {
        const response = await useCase.execute({
            personId: "123",
            oldPassword: "123456",
            newPassword: "654321",
        });

        expect(response.isLeft()).toBeTruthy();
        expect(response.value).toBeInstanceOf(PersonNotFoundError);
    });

    it("should return invalid password error", async () => {
        const response = await useCase.execute({
            personId: person.id,
            oldPassword: "1234567",
            newPassword: "654321",
        });

        expect(response.isLeft()).toBeTruthy();
        expect(response.value).toBeInstanceOf(InvalidPasswordError);
    });
});

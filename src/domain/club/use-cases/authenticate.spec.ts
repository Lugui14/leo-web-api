import { AuthenticateUseCase, AuthenticateUseCaseResponse } from "./authenticate";
import { InMemoryPersonRepository } from "@/../test/repositories/in-memory-person-repository";
import { FakeHashComparer } from "@/../test/cryptography/fake-hash-comparer";
import { FakeEncrypter } from "@/../test/cryptography/fake-encryptor";
import { CPF } from "../entities/value-objects/cpf";
import { Person } from "../entities/person";
import { Email } from "../entities/value-objects/email";
import { FakeHashGenerator } from "@/../test/cryptography/fake-hash-generator";
import { PersonNotFoundError } from "./errors/person-not-found";
import { InvalidPasswordError } from "./errors/invalid-password";

describe("Authentication use case tests", () => {
    const mockPersonRepository = new InMemoryPersonRepository();
    const mockHashComparer = new FakeHashComparer();
    const mockHashGenerator = new FakeHashGenerator();
    const mockEncrypter = new FakeEncrypter();

    const useCase = new AuthenticateUseCase(mockPersonRepository, mockHashComparer, mockEncrypter);

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

        await mockPersonRepository.save(person1);
    });

    it("should authenticate a user", async () => {
        const response = await useCase.execute({
            email: "test@test.com",
            password: "123456",
        });

        const accessToken = response.fold(
            () => "error",
            (res: AuthenticateUseCaseResponse) => res.accessToken,
        );

        const refreshToken = response.fold(
            () => "error",
            (res: AuthenticateUseCaseResponse) => res.refreshToken,
        );

        expect(response.isRight()).toBeTruthy();
        expect(accessToken).toBeDefined();
        expect(refreshToken).toBeDefined();
    });

    it("should return person not found error", async () => {
        const response = await useCase.execute({
            email: "t@t.com",
            password: "123456",
        });

        expect(response.isLeft()).toBeTruthy();
        expect(response.value).toBeInstanceOf(PersonNotFoundError);
    });

    it("should return invalid password error", async () => {
        const response = await useCase.execute({
            email: "test@test.com",
            password: "123457",
        });

        expect(response.isLeft()).toBeTruthy();
        expect(response.value).toBeInstanceOf(InvalidPasswordError);
    });
});

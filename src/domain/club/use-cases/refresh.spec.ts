import { InMemoryPersonRepository } from "@/../test/repositories/in-memory-person-repository";
import { RefreshUseCase, RefreshUseCasePropsResponse } from "./refresh";
import { FakeEncrypter } from "@/../test/cryptography/fake-encryptor";
import { Person } from "../entities/person";
import { Email } from "../entities/value-objects/email";
import { FakeHashGenerator } from "@/../test/cryptography/fake-hash-generator";
import { CPF } from "../entities/value-objects/cpf";
import { InvalidTokenError } from "./errors/invalid-token";
import { MonthlyFeeList } from "../entities/monthly-fee-list";

describe("Refresh use case tests", () => {
    const mockPersonRepository = new InMemoryPersonRepository();
    const mockEncrypter = new FakeEncrypter();
    const mockHashGenerator = new FakeHashGenerator();

    const refreshUseCase = new RefreshUseCase(mockPersonRepository, mockEncrypter);

    let person: Person;

    beforeAll(async () => {
        const person1 = Person.create(
            {
                name: "Test",
                email: new Email("test@test.com"),
                password: await mockHashGenerator.generateHash("123456"),
                birthdate: new Date("1999-01-01"),
                cpf: new CPF("303.124.220-32"),
                refreshToken: `{ "sub": "123", "type": "refresh_token" }`,
                roles: [],
                monthlyFees: new MonthlyFeeList(),
            },
            "123",
        );

        person = await mockPersonRepository.save(person1);
    });

    it("should get refresh token", async () => {
        const response = await refreshUseCase.execute(person.refreshToken ?? "");

        const result = response.value as RefreshUseCasePropsResponse;

        expect(response.isRight()).toBeTruthy();
        expect(result.accessToken).toBeDefined();
        expect(result.refreshToken).toBeDefined();
    });

    it("should not reuse refresh token", async () => {
        const refreshTokenToReuse = person.refreshToken;
        await refreshUseCase.execute(refreshTokenToReuse ?? "");

        const response = await refreshUseCase.execute(refreshTokenToReuse ?? "");

        expect(response.isLeft()).toBeTruthy();
        expect(response.value instanceof InvalidTokenError).toBeTruthy();
    });
});

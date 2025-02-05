import { InMemoryPersonRepository } from "@/../test/repositories/in-memory-person-repository";
import { SignUpUseCase } from "./signup";
import { FakeHashGenerator } from "@/../test/cryptography/fake-hash-generator";
import { Person } from "../entities/person";
import { PersonAlreadyExists } from "./errors/person-already-exists";

describe("SignUp use case tests", () => {
    const mockPersonRepository = new InMemoryPersonRepository();
    const mockHashGenerator = new FakeHashGenerator();

    const signUpUseCase = new SignUpUseCase(mockPersonRepository, mockHashGenerator);

    it("should signup a new person", async () => {
        const newPerson = {
            name: "newPerson",
            email: "newPerson@test.com",
            cpf: "303.124.220-32",
            birthdate: "1999-01-01",
            password: "123456",
        };

        const response = await signUpUseCase.execute(newPerson);

        const personResult = response.value as Person;

        expect(response.isRight()).toBeTruthy();
        expect(personResult).toBeInstanceOf(Person);
        expect(personResult.name).toBe("newPerson");
        expect(personResult.email.value).toBe("newPerson@test.com");
        expect(personResult.cpf.value).toBe("303.124.220-32");
        expect(personResult.birthdate.toISOString()).toBe(new Date("1999-01-01").toISOString());
    });

    it("should return email already in use error", async () => {
        const newPerson = {
            name: "newPerson",
            email: "newPerson@test.com",
            cpf: "303.124.220-32",
            birthdate: "1999-01-01",
            password: "123456",
        };

        await signUpUseCase.execute(newPerson);

        const newPerson2 = {
            name: "newPerson2",
            email: "newPerson@test.com",
            cpf: "897.262.050-50",
            birthdate: "1999-01-01",
            password: "123456",
        };

        const response = await signUpUseCase.execute(newPerson2);

        const result = response.value as PersonAlreadyExists;

        expect(response.isLeft()).toBeTruthy();
        expect(result).toBeInstanceOf(PersonAlreadyExists);
        expect(result.message).toBe("Person already exists");
    });
});

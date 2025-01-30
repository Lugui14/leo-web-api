import { Position } from "./enums/position";
import { InvalidCPFError } from "./errors/invalid-cpf-error";
import { MonthlyFee } from "./monthly-fee";
import { Person } from "./person";
import { CPF } from "./value-objects/cpf";
import { Email } from "./value-objects/email";

describe("Person entity test", () => {
    const birthdate = new Date("1990-01-01");
    const email = new Email("alice@example.com");
    const cpf = new CPF("123.456.789-09");

    const monthlyFee1 = MonthlyFee.create({
        value: 50,
        dueDate: new Date("2023-10-01"),
    });

    it("should create a person with valid attributes", () => {
        const person = Person.create({
            name: "Alice",
            email,
            cpf,
            birthdate,
            password: "securepassword",
            position: Position.Associated,
            monthlyFees: [monthlyFee1],
        });

        expect(person.name).toBe("Alice");
        expect(person.email.value).toBe("alice@example.com");
        expect(person.cpf.value).toBe("123.456.789-09");
        expect(person.birthdate).toEqual(birthdate);
        expect(person.password).toBe("securepassword");
        expect(person.position).toBe(Position.Associated);
        expect(person.monthlyFees).toContain(monthlyFee1);
    });

    it("should throw an error when creating a person with an invalid CPF", () => {
        expect(() =>
            Person.create({
                name: "Alice",
                email,
                cpf: new CPF("123.456.789-00"),
                birthdate,
                password: "securepassword",
                position: Position.Associated,
                monthlyFees: [monthlyFee1],
            }),
        ).toThrow(InvalidCPFError);
    });
});

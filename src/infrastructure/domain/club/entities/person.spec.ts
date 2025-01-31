import { Position } from "./enums/position";
import { MonthlyFeeAlreadyExistsError } from "./errors/monthly-fee-already-exists";
import { MonthlyFee } from "./monthly-fee";
import { Person } from "./person";
import { CPF } from "./value-objects/cpf";
import { Email } from "./value-objects/email";

describe("Person entity test", () => {
    const birthdate = new Date("1990-01-01");
    const email = new Email("alice@example.com");
    const cpf = new CPF("696.061.050-83");

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
            position: Position.ASSOCIATED,
            monthlyFees: [monthlyFee1],
        });

        expect(person.name).toBe("Alice");
        expect(person.email.value).toBe("alice@example.com");
        expect(person.cpf.value).toBe("696.061.050-83");
        expect(person.birthdate).toEqual(birthdate);
        expect(person.password).toBe("securepassword");
        expect(person.position).toBe(Position.ASSOCIATED);
        expect(person.monthlyFees).toContain(monthlyFee1);
    });

    it("should not add a monthly fee that already exists", () => {
        const monthlyFee2 = MonthlyFee.create({
            value: 50,
            dueDate: new Date("2023-10-01"),
        });

        const person = Person.create({
            name: "Alice",
            email,
            cpf,
            birthdate,
            password: "securepassword",
            position: Position.ASSOCIATED,
            monthlyFees: [monthlyFee1],
        });

        expect(() => person.addMonthlyFee(monthlyFee2)).toThrow(MonthlyFeeAlreadyExistsError);
    });
});

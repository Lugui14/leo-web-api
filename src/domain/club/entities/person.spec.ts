import { MonthlyFee } from "./monthly-fee";
import { Person } from "./person";
import { CPF } from "./value-objects/cpf";
import { Email } from "./value-objects/email";
import { RoleEnum } from "./enums/role";
import { MonthlyFeeList } from "./monthly-fee-list";

describe("Person entity test", () => {
    const birthdate = new Date("1990-01-01");
    const email = new Email("alice@example.com");
    const cpf = new CPF("696.061.050-83");

    const monthlyFee1 = MonthlyFee.create({
        value: 50,
        dueDate: new Date("2023-10-01"),
        status: "PENDING",
    });

    it("should create a person with valid attributes", () => {
        const person = Person.create({
            name: "Alice",
            email,
            cpf,
            birthdate,
            password: "$2a$12$ASRwBStOwCfQnm5/zXNcyu/.qgcDlwAax6PqQlE7Ojh4RY.O/385y",
            roles: [RoleEnum.ASSOCIATED],
            monthlyFees: new MonthlyFeeList([monthlyFee1]),
        });

        expect(person.name).toBe("Alice");
        expect(person.email.value).toBe("alice@example.com");
        expect(person.cpf.value).toBe("696.061.050-83");
        expect(person.birthdate).toEqual(birthdate);
        expect(person.password).toBe("$2a$12$ASRwBStOwCfQnm5/zXNcyu/.qgcDlwAax6PqQlE7Ojh4RY.O/385y");
        expect(person.roles).toContain(RoleEnum.ASSOCIATED);
        expect(person.monthlyFees.getItems()).toContain(monthlyFee1);
    });
});

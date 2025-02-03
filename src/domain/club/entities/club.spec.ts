import { Club } from "./club";
import { RoleEnum } from "./enums/role";
import { PersonAlreadyInClubError } from "./errors/person-already-in-club-error";
import { MonthlyFee } from "./monthly-fee";
import { Person } from "./person";
import { Role } from "./role";
import { CPF } from "./value-objects/cpf";
import { Email } from "./value-objects/email";

describe("Club entity test", () => {
    const associatedRole = Role.create({ name: RoleEnum.ASSOCIATED });
    const preleoRole = Role.create({ name: RoleEnum.PRE_LEO });

    const monthlyFee1 = MonthlyFee.create({
        value: 50,
        dueDate: new Date("2023-10-01"),
    });

    const monthlyFee2 = MonthlyFee.create({
        value: 50,
        dueDate: new Date("2023-11-01"),
    });

    const person1 = Person.create({
        name: "Alice",
        email: new Email("alice@example.com"),
        birthdate: new Date("1990-01-01"),
        cpf: new CPF("388.645.490-80"),
        password: "$2a$12$ASRwBStOwCfQnm5/zXNcyu/.qgcDlwAax6PqQlE7Ojh4RY.O/385y",
        roles: [associatedRole],
        monthlyFees: [monthlyFee1],
    });

    const person2 = Person.create({
        name: "Bob",
        email: new Email("bob@example.com"),
        birthdate: new Date("1995-05-05"),
        cpf: new CPF("559.555.900-48"),
        password: "$2a$12$ASRwBStOwCfQnm5/zXNcyu/.qgcDlwAax6PqQlE7Ojh4RY.O/385y",
        roles: [preleoRole],
        monthlyFees: [monthlyFee2],
    });

    beforeEach(() => {
        person1.clubId = undefined;
        person2.clubId = undefined;
    });

    it("should create a club with valid attributes", () => {
        const club = Club.create({
            name: "Example Club",
            persons: [person1, person2],
        });

        expect(club.name).toBe("Example Club");
        expect(club.persons).toEqual([person1, person2]);
    });

    it("should add a person to the club", () => {
        const club = Club.create({
            name: "Example Club",
            persons: [person1],
        });

        club.addPerson(person2);
        expect(club.persons).toEqual([person1, person2]);
    });

    it("should throw error on adding a person that is already in another club", () => {
        const club1 = Club.create({
            name: "Example Club 1",
            persons: [],
        });

        const club2 = Club.create({
            name: "Example Club 2",
            persons: [],
        });

        club1.addPerson(person1);
        expect(() => club2.addPerson(person1)).toThrow(PersonAlreadyInClubError);
    });

    it("should calculate the total monthly revenue", () => {
        monthlyFee1.markAsPaid();
        monthlyFee2.markAsPaid();

        const club = Club.create({
            name: "Example Club",
            persons: [person1, person2],
        });

        expect(club.calculateTotalMonthlyRevenue()).toBe(100);
    });
});

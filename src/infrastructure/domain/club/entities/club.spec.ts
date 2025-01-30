import { Club } from "./club";
import { Position } from "./enums/position";
import { PersonAlreadyInClubError } from "./errors/person-already-in-club-error";
import { MonthlyFee } from "./monthly-fee";
import { Person } from "./person";
import { CPF } from "./value-objects/cpf";
import { Email } from "./value-objects/email";

describe("Club entity test", () => {
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
        cpf: new CPF("000.000.000-00"),
        password: "securepassword",
        position: Position.Associated,
        monthlyFees: [monthlyFee1],
    });

    const person2 = Person.create({
        name: "Bob",
        email: new Email("bob@example.com"),
        birthdate: new Date("1995-05-05"),
        cpf: new CPF("111.111.111-11"),
        password: "securepassword",
        position: Position.Manager,
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

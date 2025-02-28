import { InMemoryPersonRepository } from "@/../test/repositories/in-memory-person-repository";
import { Person } from "@/domain/club/entities/person";
import { Email } from "@/domain/club/entities/value-objects/email";
import { CPF } from "@/domain/club/entities/value-objects/cpf";
import { PayMonthlyFeeUseCase } from "./pay-monthly-fee";
import { PersonNotFoundError } from "./errors/person-not-found";
import { MonthOutOfRangeError } from "./errors/month-out-of-range";
import { MonthlyFee } from "../entities/monthly-fee";

describe("Pay Monthly Fee Use Case Tests", () => {
    const mockPersonRepository = new InMemoryPersonRepository();

    const useCase = new PayMonthlyFeeUseCase(mockPersonRepository);

    let person: Person;

    beforeAll(async () => {
        const monthlyFees: MonthlyFee[] = [];

        for (let i = 1; i <= 12; i++) {
            monthlyFees.push(
                MonthlyFee.create({
                    dueDate: new Date(2025, i, 5),
                    value: 30,
                }),
            );
        }

        person = await mockPersonRepository.save(
            Person.create({
                name: "Test User",
                email: new Email("testuser@test.com"),
                password: "123456",
                birthdate: new Date("1990-01-01"),
                cpf: new CPF("048.111.850-05"),
                roles: [],
                monthlyFees: monthlyFees,
            }),
        );
    });

    it("Should pay monthly fee for the current month", async () => {
        const response = await useCase.execute({ personId: person.id });

        const monthlyFees = response.value as MonthlyFee[];

        expect(response.isRight()).toBeTruthy();
        expect(response.value).toBeInstanceOf(Array);

        const monthFee = monthlyFees.find((fee) => fee.dueDate.getMonth() === new Date().getMonth());

        expect(monthFee?.status).toBe("PAID");
    });

    it("Should pay monthly fee for a specific month", async () => {
        const response = await useCase.execute({ personId: person.id, month: 4 });

        const monthlyFees = response.value as MonthlyFee[];

        expect(response.isRight()).toBeTruthy();
        expect(response.value).toBeInstanceOf(Array);

        const monthFee = monthlyFees.find((fee) => fee.dueDate.getMonth() === 4);

        expect(monthFee?.status).toBe("PAID");
    });

    it("Should return PersonNotFoundError if person does not exist", async () => {
        const response = await useCase.execute({ personId: "non-existing-id" });

        expect(response.isLeft()).toBeTruthy();
        expect(response.value).toBeInstanceOf(PersonNotFoundError);
    });

    it("Should return MonthOutOfRangeError if month is out of range", async () => {
        const response = await useCase.execute({ personId: person.id, month: 13 });

        expect(response.isLeft()).toBeTruthy();
        expect(response.value).toBeInstanceOf(MonthOutOfRangeError);
    });
});

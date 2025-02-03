import { MonthlyFee } from "./monthly-fee";

describe("MonthlyFee entity test", () => {
    it("should create a monthly fee with valid attributes", () => {
        const monthlyFee = MonthlyFee.create({
            value: 50,
            dueDate: new Date("2023-10-01"),
        });

        expect(monthlyFee.value).toBe(50);
        expect(monthlyFee.dueDate).toEqual(new Date("2023-10-01"));
        expect(monthlyFee.status).toBe("PENDING");
    });

    it("should mark a monthly fee as paid", () => {
        const monthlyFee = MonthlyFee.create({
            value: 50,
            dueDate: new Date("2023-10-01"),
        });

        monthlyFee.markAsPaid();

        expect(monthlyFee.status).toBe("PAID");
    });
});

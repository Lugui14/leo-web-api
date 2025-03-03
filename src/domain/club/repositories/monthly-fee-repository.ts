import { MonthlyFee } from "../entities/monthly-fee";

export abstract class MonthlyFeeRepository {
    abstract findById(id: string): Promise<MonthlyFee | null>;
    abstract findByPersonId(personId: string): Promise<MonthlyFee[] | null>;
}

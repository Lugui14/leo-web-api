import { WatchedList } from "@/core/watched-list";
import { MonthlyFee } from "./monthly-fee";

export class MonthlyFeeList extends WatchedList<MonthlyFee> {
    compareItems(a: MonthlyFee, b: MonthlyFee): boolean {
        return a.id === b.id;
    }
}

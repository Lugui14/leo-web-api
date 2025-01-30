import { Entity } from "@/core/entity";

interface MonthlyFeeProps {
    value: number;
    dueDate: Date;
    status: "Paid" | "Pending";
}

export class MonthlyFee extends Entity<MonthlyFeeProps> {
    private constructor(props: MonthlyFeeProps, id?: string) {
        super(props, id);
    }

    get value(): number {
        return this.props.value;
    }

    get dueDate(): Date {
        return this.props.dueDate;
    }

    get status(): "Paid" | "Pending" {
        return this.props.status;
    }

    markAsPaid(): void {
        this.props.status = "Paid";
    }

    static create(props: Omit<MonthlyFeeProps, "status">, id?: string): MonthlyFee {
        return new MonthlyFee({ ...props, status: "Pending" }, id);
    }
}

import { MonthlyFee } from "@/domain/club/entities/monthly-fee";
import { MonthlyFee as PrismaMonthlyFee } from "@prisma/client";

export class MonthlyFeeMapper {
    static toEntity(monthlyFee: PrismaMonthlyFee): MonthlyFee {
        return MonthlyFee.create(
            {
                value: monthlyFee.value,
                dueDate: monthlyFee.dueDate,
                status: monthlyFee.status,
            },
            monthlyFee.id,
        );
    }
}

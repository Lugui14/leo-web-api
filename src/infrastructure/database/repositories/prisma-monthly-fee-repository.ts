import { Injectable } from "@nestjs/common";
import { MonthlyFeeRepository } from "@/domain/club/repositories/monthly-fee-repository";
import { MonthlyFee } from "@/domain/club/entities/monthly-fee";
import { MonthlyFeeMapper } from "../mappers/prisma-monthly-fee-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaMonthlyFeeRepository implements MonthlyFeeRepository {
    constructor(private prisma: PrismaService) {}

    async findById(id: string): Promise<MonthlyFee | null> {
        const prismaMonthlyFee = await this.prisma.monthlyFee.findUnique({
            where: { id },
        });

        return prismaMonthlyFee ? MonthlyFeeMapper.toEntity(prismaMonthlyFee) : null;
    }

    async findByPersonId(personId: string): Promise<MonthlyFee[] | null> {
        const prismaMonthlyFees = await this.prisma.monthlyFee.findMany({
            where: { personId },
        });

        return prismaMonthlyFees?.map((prismaMonthlyFee) => MonthlyFeeMapper.toEntity(prismaMonthlyFee));
    }
}

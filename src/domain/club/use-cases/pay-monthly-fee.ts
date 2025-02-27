import { Either, left, right } from "@/core/either";
import { PersonRepository } from "@/domain/club/repositories/person-repository";
import { Injectable } from "@nestjs/common";
import { PersonNotFoundError } from "./errors/person-not-found";
import { MonthlyFee } from "../entities/monthly-fee";
import { MonthOutOfRangeError } from "./errors/month-out-of-range";

interface PayMonthlyFeeProps {
    personId: string;
    month?: number;
}

@Injectable()
export class PayMonthlyFeeUseCase {
    constructor(private personRepository: PersonRepository) {}

    async execute({
        personId,
        month,
    }: PayMonthlyFeeProps): Promise<Either<PersonNotFoundError | MonthOutOfRangeError, MonthlyFee[]>> {
        if (month && (month < 1 || month > 12)) return left(new MonthOutOfRangeError());

        const person = await this.personRepository.findById(personId);

        if (!person) return left(new PersonNotFoundError());

        let date = new Date();
        if (month) date = new Date(date.getFullYear(), month - 1, date.getDate());

        person.payMonthlyFee(date);

        const updatedPerson = await this.personRepository.update(person);

        return right(updatedPerson.monthlyFees);
    }
}

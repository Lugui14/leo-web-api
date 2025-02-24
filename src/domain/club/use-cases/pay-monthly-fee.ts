import { PersonRepository } from "@/domain/club/repositories/person-repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PayMonthlyFeeUseCase {
    constructor(private personRepository: PersonRepository) {}

    async execute(): Promise<void> {}
}

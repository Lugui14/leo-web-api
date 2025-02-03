import * as bcrypt from "bcrypt";
import { PersonRepository } from "../repositories/person-repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ChangePasswordUseCase {
    constructor(private personRepository: PersonRepository) {}

    async execute(personId: string, oldPassword: string, newPassword: string): Promise<void> {
        // Find the person by ID
        const person = await this.personRepository.findById(personId);
        if (!person) {
            throw new Error("Person not found");
        }

        // Verify the old password
        const isOldPasswordValid = bcrypt.compareSync(oldPassword, person.password);
        if (!isOldPasswordValid) {
            throw new Error("Invalid old password");
        }

        // Hash the new password
        const salt = bcrypt.genSaltSync(12);
        const hashedPassword = bcrypt.hashSync(newPassword, salt);

        // Update the person's password and salt
        person.password = hashedPassword;

        // Save the updated person
        await this.personRepository.save(person);
    }
}

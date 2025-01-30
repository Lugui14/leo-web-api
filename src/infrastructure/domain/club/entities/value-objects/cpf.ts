import { InvalidCPFError } from "../errors/invalid-cpf-error";

export class CPF {
    value: string;

    constructor(value: string) {
        this.validate(value);
        this.value = value;
    }

    private validate(cpf: string): void {
        // Remove non-numeric characters
        const cleanedCpf = cpf.replace(/\D/g, "");

        // Check if the CPF has 11 digits
        if (cleanedCpf.length !== 11) {
            throw new InvalidCPFError("CPF must have 11 digits");
        }

        // Check if all digits are the same (invalid CPF)
        if (/^(\d)\1{10}$/.test(cleanedCpf)) {
            throw new InvalidCPFError("Invalid CPF");
        }

        // Validate the CPF using the official algorithm
        if (!this.isValidCpf(cleanedCpf)) {
            throw new InvalidCPFError("Invalid CPF");
        }
    }

    private isValidCpf(cpf: string): boolean {
        // Extract the first 9 digits and the verification digits
        const digits = cpf.substring(0, 9).split("").map(Number);
        const verificationDigits = cpf.substring(9).split("").map(Number);

        // Calculate the first verification digit
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += digits[i] * (10 - i);
        }
        const firstDigit = (sum * 10) % 11;
        if (firstDigit !== verificationDigits[0]) {
            return false;
        }

        // Calculate the second verification digit
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += (i < 9 ? digits[i] : verificationDigits[0]) * (11 - i);
        }
        const secondDigit = (sum * 10) % 11;
        if (secondDigit !== verificationDigits[1]) {
            return false;
        }

        return true;
    }
}

import { InvalidEmailError } from "../errors/invalid-email-error";

export class Email {
    value: string;

    constructor(value: string) {
        this.value = value;
        this.validate(value);
    }

    private validate(email: string): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new InvalidEmailError("Invalid email format");
        }
    }
}

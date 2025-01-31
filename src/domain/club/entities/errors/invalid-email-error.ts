export class InvalidEmailError extends Error {
    constructor(message: string = "Invalid email format") {
        super(message);
        this.name = "InvalidEmailError";
    }
}

export class InvalidCPFError extends Error {
    constructor(message: string = "Invalid cpf format") {
        super(message);
        this.name = "InvalidCPFError";
    }
}

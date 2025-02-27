export class InvalidCNPJError extends Error {
    constructor(message: string = "Invalid CNPJ format") {
        super(message);
        this.name = "InvalidCNPJError";
    }
}

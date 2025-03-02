export class MonthlyFeeAlreadyExistsError extends Error {
    constructor(message: string = "Monthly fee for this month already exists") {
        super(message);
        this.name = "MonthlyFeeAlreadyExists";
    }
}

export class MonthOutOfRangeError extends Error {
    constructor() {
        super("Month out of range (1-12)");
        this.name = "MonthOutOfRange";
    }
}

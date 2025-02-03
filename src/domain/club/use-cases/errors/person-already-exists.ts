export class PersonAlreadyExists extends Error {
    constructor() {
        super("Person already exists");
        this.name = "PersonAlreadyExists";
    }
}

import { ForbiddenException } from "@nestjs/common";

export class PersonNotFoundError extends ForbiddenException {
    constructor() {
        super("Invalid credentials");
        this.name = "PersonNotFound";
    }
}

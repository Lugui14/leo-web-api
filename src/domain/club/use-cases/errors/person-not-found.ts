import { ForbiddenException } from "@nestjs/common";

export class ForbiddenPersonNotFoundError extends ForbiddenException {
    constructor() {
        super("Invalid credentials");
        this.name = "ForbiddenPersonNotFound";
    }
}

export class PersonNotFoundError extends Error {
    constructor(alternativeMessage?: string) {
        super(alternativeMessage || "Person does not exists");
        this.name = "PersonNotFound";
    }
}

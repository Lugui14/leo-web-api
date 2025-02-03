import { ForbiddenException } from "@nestjs/common";

export class InvalidPasswordError extends ForbiddenException {
    constructor() {
        super("Invalid credentials");
        this.name = "InvalidPassword";
    }
}

import { UnauthorizedException } from "@nestjs/common";

export class InvalidTokenError extends UnauthorizedException {
    constructor(message: string = "Invalid token") {
        super(message);
        this.name = "InvalidTokenError";
    }
}

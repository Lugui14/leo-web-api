import { ForbiddenException } from "@nestjs/common";

export class ClubNotFoundError extends ForbiddenException {
    constructor() {
        super("Club does not exists");
        this.name = "ClubNotExists";
    }
}

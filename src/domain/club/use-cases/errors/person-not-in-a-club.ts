export class PersonNotInAClubError extends Error {
    constructor() {
        super("This person is not in a club");
        this.name = "PersonNotInAClub";
    }
}

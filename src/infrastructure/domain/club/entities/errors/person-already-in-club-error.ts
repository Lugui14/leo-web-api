export class PersonAlreadyInClubError extends Error {
    constructor() {
        super("Person already in another club");
        this.name = "PersonAlreadyInClub";
    }
}

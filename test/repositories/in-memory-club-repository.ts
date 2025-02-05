import { Club } from "@/domain/club/entities/club";
import { ClubRepository } from "@/domain/club/repositories/club-repository";

export class InMemoryClubRepository implements ClubRepository {
    private clubs: Club[];

    constructor() {
        this.clubs = [];
    }
    save(club: Club): Promise<Club> {
        return new Promise((resolve) => {
            this.clubs.push(club);
            return resolve(club);
        });
    }

    findById(id: string): Promise<Club | null> {
        return new Promise((resolve) => {
            const club = this.clubs.find((club) => club.id === id);
            return resolve(club ?? null);
        });
    }

    findAll(): Promise<Club[]> {
        return new Promise((resolve) => {
            return resolve(this.clubs);
        });
    }
}

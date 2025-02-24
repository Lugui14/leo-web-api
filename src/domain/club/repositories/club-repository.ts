import { Club } from "../entities/club";

export abstract class ClubRepository {
    abstract save(club: Club): Promise<Club>;
    abstract findById(id: string): Promise<Club | null>;
    abstract findAll(): Promise<Club[]>;
    abstract update(club: Club): Promise<Club>;
}

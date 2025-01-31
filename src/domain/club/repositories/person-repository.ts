import { Person } from "../entities/person";

export interface PersonRepository {
    save(person: Person): Promise<void>;
    findByEmail(email: string): Promise<Person | null>;
    findById(id: string): Promise<Person | null>;
}

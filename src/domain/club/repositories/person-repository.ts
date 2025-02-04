import { Person } from "../entities/person";

export abstract class PersonRepository {
    abstract save(person: Person): Promise<Person>;
    abstract findByEmail(email: string): Promise<Person | null>;
    abstract findById(id: string): Promise<Person | null>;
    abstract update(person: Person): Promise<Person>;
}

import { Person } from "@/domain/club/entities/person";
import { PersonRepository } from "@/domain/club/repositories/person-repository";

export class InMemoryPersonRepository implements PersonRepository {
    private persons: Person[];

    constructor() {
        this.persons = [];
    }

    save(person: Person): Promise<Person> {
        return new Promise((resolve) => {
            this.persons.push(person);
            return resolve(person);
        });
    }
    findByEmail(email: string): Promise<Person | null> {
        return new Promise((resolve) => {
            const person = this.persons.find((person) => person.email.value === email);
            return resolve(person ?? null);
        });
    }

    findByClubId(clubId: string): Promise<Person[] | null> {
        return new Promise((resolve) => {
            const persons = this.persons.filter((person) => person.clubId === clubId);
            return resolve(persons.length > 0 ? persons : null);
        });
    }

    findById(id: string): Promise<Person | null> {
        return new Promise((resolve) => {
            const person = this.persons.find((person) => person.id === id);
            return resolve(person ?? null);
        });
    }

    update(person: Person): Promise<Person> {
        return new Promise((resolve) => {
            const index = this.persons.findIndex((p) => p.id === person.id);
            this.persons[index] = person;
            return resolve(person);
        });
    }
}

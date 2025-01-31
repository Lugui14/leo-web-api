import { AggregateRoot } from "@/core/aggregate-root";
import { Person } from "./person";
import { PersonAlreadyInClubError } from "./errors/person-already-in-club-error";

interface ClubProps {
    name: string;
    persons: Person[];
}

export class Club extends AggregateRoot<ClubProps> {
    private constructor(props: ClubProps, id?: string) {
        props.persons.forEach((person) => {
            if (person.clubId && person.clubId !== id) {
                throw new PersonAlreadyInClubError();
            }

            person.clubId = id;
        });

        super(props, id);
    }

    get name(): string {
        return this.props.name;
    }

    get persons(): Person[] {
        return this.props.persons;
    }

    addPerson(person: Person): void {
        if (person.clubId && person.clubId !== this.id) {
            throw new PersonAlreadyInClubError();
        }

        person.clubId = this.id;
        this.props.persons.push(person);
    }

    calculateTotalMonthlyRevenue(): number {
        return this.props.persons.reduce((total, person) => total + person.getTotalFeesPaid(), 0);
    }

    static create(props: ClubProps, id?: string): Club {
        return new Club(props, id);
    }
}

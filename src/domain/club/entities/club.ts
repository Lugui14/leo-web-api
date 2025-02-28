import { AggregateRoot } from "@/core/aggregate-root";
import { Person } from "./person";
import { PersonAlreadyInClubError } from "./errors/person-already-in-club-error";
import { CNPJ } from "./value-objects/cnpj";

interface ClubProps {
    name: string;
    cnpj: CNPJ;
    persons: Person[];
}

export class Club extends AggregateRoot<ClubProps> {
    private constructor(props: ClubProps, id?: string) {
        super(props, id);
    }

    get name(): string {
        return this.props.name;
    }

    get persons(): Person[] {
        return this.props.persons;
    }

    get cnpj(): CNPJ {
        return this.props.cnpj;
    }

    addPerson(person: Person): void {
        if (person.clubId && person.clubId !== this.id) {
            throw new PersonAlreadyInClubError();
        }

        person.clubId = this.id;
        this.props.persons.push(person);
    }

    removePerson(personId: string): void {
        this.props.persons = this.props.persons.filter((p) => p.id !== personId);
    }

    calculateTotalMonthlyRevenue(): number {
        return this.props.persons.reduce((total, person) => total + person.getTotalFeesPaid(), 0);
    }

    static create(props: ClubProps, id?: string): Club {
        return new Club(props, id);
    }
}

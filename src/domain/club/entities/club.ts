import { AggregateRoot } from "@/core/aggregate-root";
import { Person } from "./person";
import { PersonAlreadyInClubError } from "./errors/person-already-in-club-error";
import { CNPJ } from "./value-objects/cnpj";
import { ClubPersonList } from "./club-person-list";

interface ClubProps {
    name: string;
    cnpj: CNPJ;
    persons: ClubPersonList;
}

export class Club extends AggregateRoot<ClubProps> {
    private constructor(props: ClubProps, id?: string) {
        super(props, id);
    }

    get name(): string {
        return this.props.name;
    }

    get persons(): ClubPersonList {
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
        this.props.persons.add(person);
    }

    removePerson(personId: string): void {
        this.props.persons.update(this.persons.getItems().filter((p) => p.id !== personId));
    }

    calculateTotalMonthlyRevenue(): number {
        return this.props.persons.getItems().reduce((total, person) => total + person.getTotalFeesPaid(), 0);
    }

    static create(props: ClubProps, id?: string): Club {
        return new Club(props, id);
    }
}

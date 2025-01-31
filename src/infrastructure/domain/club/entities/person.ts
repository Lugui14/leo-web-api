import { Entity } from "@/core/entity";
import { Email } from "./value-objects/email";
import { Position } from "./enums/position";
import { MonthlyFee } from "./monthly-fee";
import { MonthlyFeeAlreadyExistsError } from "./errors/monthly-fee-already-exists";
import { CPF } from "./value-objects/cpf";

interface PersonProps {
    name: string;
    email: Email;
    cpf: CPF;
    birthdate: Date;
    password: string;
    position: Position;
    monthlyFees: MonthlyFee[];
    clubId?: string;
}

export class Person extends Entity<PersonProps> {
    private constructor(props: PersonProps, id?: string) {
        super(props, id);
    }

    get name(): string {
        return this.props.name;
    }

    get email(): Email {
        return this.props.email;
    }

    get cpf(): CPF {
        return this.props.cpf;
    }

    get birthdate(): Date {
        return this.props.birthdate;
    }

    get password(): string {
        return this.props.password;
    }

    get position(): Position {
        return this.props.position;
    }

    get monthlyFees(): MonthlyFee[] {
        return this.props.monthlyFees;
    }

    get clubId(): string | undefined {
        return this.props.clubId;
    }

    set clubId(clubId: string | undefined) {
        this.props.clubId = clubId;
    }

    addMonthlyFee(monthlyFee: MonthlyFee): void {
        const existingFee = this.props.monthlyFees.find(
            (fee) => fee.dueDate.getMonth() === monthlyFee.dueDate.getMonth(),
        );

        if (existingFee) {
            throw new MonthlyFeeAlreadyExistsError();
        }

        this.props.monthlyFees.push(monthlyFee);
    }

    getTotalFeesPaid(): number {
        return this.props.monthlyFees
            .filter((fee) => fee.status === "Paid")
            .reduce((total, fee) => total + fee.value, 0);
    }

    static create(props: PersonProps, id?: string): Person {
        return new Person(props, id);
    }
}

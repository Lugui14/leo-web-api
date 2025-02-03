import { Entity } from "@/core/entity";
import { Email } from "./value-objects/email";
import { Role } from "./role";
import { MonthlyFee } from "./monthly-fee";
import { MonthlyFeeAlreadyExistsError } from "./errors/monthly-fee-already-exists";
import { CPF } from "./value-objects/cpf";

export type PersonPropsDto = Omit<Person, "password" & "refreshToken">;

interface PersonProps {
    name: string;
    email: Email;
    cpf: CPF;
    birthdate: Date;
    password: string;
    refreshToken?: string;
    roles: Role[];
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

    set password(password: string) {
        this.props.password = password;
    }

    get refreshToken(): string | undefined {
        return this.props.refreshToken;
    }

    set refreshToken(refreshToken: string | undefined) {
        this.props.refreshToken = refreshToken;
    }

    get roles(): Role[] {
        return this.props.roles;
    }

    set roles(roles: Role[]) {
        this.props.roles = roles;
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
            .filter((fee) => fee.status === "PAID")
            .reduce((total, fee) => total + fee.value, 0);
    }

    static create(props: PersonProps, id?: string): Person {
        return new Person(props, id);
    }
}

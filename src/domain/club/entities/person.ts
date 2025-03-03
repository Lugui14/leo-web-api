import { Entity } from "@/core/entity";
import { Email } from "./value-objects/email";
import { CPF } from "./value-objects/cpf";
import { RoleEnum } from "./enums/role";
import { MonthlyFeeList } from "./monthly-fee-list";

export type PersonPropsDto = Omit<Person, "password" & "refreshToken">;

interface PersonProps {
    name: string;
    email: Email;
    cpf: CPF;
    birthdate: Date;
    password: string;
    refreshToken?: string;
    roles: RoleEnum[];
    monthlyFees: MonthlyFeeList;
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

    get roles(): RoleEnum[] {
        return this.props.roles;
    }

    set roles(roles: RoleEnum[]) {
        this.props.roles = roles;
    }

    get monthlyFees(): MonthlyFeeList {
        return this.props.monthlyFees;
    }

    get clubId(): string | undefined {
        return this.props.clubId;
    }

    set clubId(clubId: string | undefined) {
        this.props.clubId = clubId;
    }

    payMonthlyFee(date: Date = new Date()): void {
        const fee = this.props.monthlyFees
            .getItems()
            .find(
                (fee) => fee.dueDate.getMonth() === date.getMonth() && fee.dueDate.getFullYear() === date.getFullYear(),
            );

        if (fee) fee.markAsPaid();
    }

    getTotalFeesPaid(): number {
        return this.props.monthlyFees
            .getItems()
            .filter((fee) => fee.status === "PAID")
            .reduce((total, fee) => total + fee.value, 0);
    }

    static create(props: PersonProps, id?: string): Person {
        return new Person(props, id);
    }
}

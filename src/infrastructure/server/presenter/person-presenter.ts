import { Person } from "@/domain/club/entities/person";

export class PersonPresenter {
    static toHttp(person: Person) {
        return {
            id: person.id,
            name: person.name,
            email: person.email.value,
            cpf: person.cpf.value,
            birthdate: person.birthdate,
        };
    }
}

import { WatchedList } from "@/core/watched-list";
import { Person } from "./person";

export class ClubPersonList extends WatchedList<Person> {
    public compareItems(a: Person, b: Person): boolean {
        return a.id === b.id;
    }
}

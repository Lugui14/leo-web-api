import { randomUUID } from "crypto";

export class Entity<Props> {
    protected readonly _id: string;
    protected props: Props;

    protected constructor(props: Props, id?: string) {
        this.props = props;
        this._id = id ?? randomUUID();
    }

    public get id(): string {
        return this._id;
    }

    public equals(entity?: Entity<Props>): boolean {
        if (entity === null || entity === undefined) {
            return false;
        }

        if (this === entity) {
            return true;
        }

        return this._id === entity._id;
    }
}

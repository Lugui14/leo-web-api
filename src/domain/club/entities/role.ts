import { Entity } from "@/core/entity";
import { RoleEnum } from "./enums/role";

interface RoleProps {
    name: RoleEnum;
}

export class Role extends Entity<RoleProps> {
    private constructor(props: RoleProps, id?: string) {
        super(props, id);
    }

    get name(): RoleEnum {
        return this.props.name;
    }

    static create(props: RoleProps, id?: string): Role {
        return new Role(props, id);
    }
}

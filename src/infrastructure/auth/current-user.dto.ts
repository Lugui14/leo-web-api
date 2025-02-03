import { RoleEnum } from "@/domain/club/entities/enums/role";
import { PersonPropsDto } from "@/domain/club/entities/person";

export interface JWTPayloadProps {
    sub: string;
    email: string;
    roles: RoleEnum[];
    type: "access_token" | "refresh_token";
}

export interface RequestProps {
    headers: {
        authorization: string;
    };
    user: PersonPropsDto;
}

export interface JWTTokenProps {
    id: string;
    email: string;
    roles: RoleEnum[];
}

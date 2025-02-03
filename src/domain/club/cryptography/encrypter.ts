import { JWTPayloadProps } from "@/infrastructure/auth/current-user.dto";

export abstract class Encrypter {
    abstract encrypt(value: object, expiresIn: string): string;

    abstract decrypt(value: string): JWTPayloadProps;
}

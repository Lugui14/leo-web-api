import { HashGenerator } from "@/domain/club/cryptography/hash-generator";
import { Injectable } from "@nestjs/common";
import { hash } from "bcrypt";

@Injectable()
export class BcryptHashGenerator implements HashGenerator {
    private SALT_ROUNDS: number = 12;

    async generateHash(value: string): Promise<string> {
        return await hash(value, this.SALT_ROUNDS);
    }
}

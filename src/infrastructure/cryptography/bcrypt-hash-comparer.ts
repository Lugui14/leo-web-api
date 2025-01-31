import { HashComparer } from "@/domain/club/cryptography/hash-comparer";
import { Injectable } from "@nestjs/common";
import { compare } from "bcrypt";

@Injectable()
export class BcryptHashComparer implements HashComparer {
    async compare(password: string, hashedPassword: string): Promise<boolean> {
        return await compare(password, hashedPassword);
    }
}

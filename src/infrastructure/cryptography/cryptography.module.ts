import { Module } from "@nestjs/common";
import { HashComparer } from "@/domain/club/cryptography/hash-comparer";
import { HashGenerator } from "@/domain/club/cryptography/hash-generator";
import { Encrypter } from "@/domain/club/cryptography/encrypter";
import { BcryptHashComparer } from "./bcrypt-hash-comparer";
import { JwtEncrypter } from "./jwt-encrypter";
import { BcryptHashGenerator } from "./bcrypt-hash-generator";

@Module({
    providers: [
        { provide: HashGenerator, useClass: BcryptHashGenerator },
        { provide: HashComparer, useClass: BcryptHashComparer },
        { provide: Encrypter, useClass: JwtEncrypter },
    ],
    exports: [HashComparer, HashGenerator, Encrypter],
})
export class CryptographyModule {}

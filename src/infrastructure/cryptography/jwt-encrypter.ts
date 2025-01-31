import { Encrypter } from "@/domain/club/cryptography/encrypter";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtEncrypter implements Encrypter {
    constructor(private jwtService: JwtService) {}

    encrypt(value: object, expiresIn?: string): string {
        return this.jwtService.sign(value, { expiresIn });
    }

    decrypt(value: string): object {
        return this.jwtService.verify(value);
    }
}

import { Encrypter } from "@/domain/club/cryptography/encrypter";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JWTPayloadProps } from "../auth/current-user.dto";

@Injectable()
export class JwtEncrypter implements Encrypter {
    constructor(private jwtService: JwtService) {}

    encrypt(value: object, expiresIn?: string): string {
        return this.jwtService.sign(value, { expiresIn });
    }

    decrypt(value: string): JWTPayloadProps {
        return this.jwtService.verify(value);
    }
}

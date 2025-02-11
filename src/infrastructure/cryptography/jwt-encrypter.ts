import { Encrypter } from "@/domain/club/cryptography/encrypter";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JWTPayloadProps } from "../auth/current-user.dto";

@Injectable()
export class JwtEncrypter implements Encrypter {
    constructor(private jwtService: JwtService) {}

    async encrypt(value: object, expiresIn?: string): Promise<string> {
        return await this.jwtService.signAsync(value, { expiresIn });
    }

    async decrypt(value: string): Promise<JWTPayloadProps> {
        return this.jwtService.verifyAsync(value);
    }
}

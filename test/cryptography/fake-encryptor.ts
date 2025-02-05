import { Encrypter } from "@/domain/club/cryptography/encrypter";

export class FakeEncrypter implements Encrypter {
    encrypt(value: object, expiresIn: string): string {
        return JSON.stringify({ value, expiresIn });
    }

    decrypt(value: string): object {
        return JSON.parse(value) as object;
    }
}

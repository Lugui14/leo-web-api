import { Encrypter } from "@/domain/club/cryptography/encrypter";

export class FakeEncrypter implements Encrypter {
    encrypt(value: object, expiresIn: string): Promise<string> {
        return Promise.resolve(JSON.stringify({ value, expiresIn }));
    }

    decrypt(value: string): Promise<object> {
        return Promise.resolve(JSON.parse(value));
    }
}

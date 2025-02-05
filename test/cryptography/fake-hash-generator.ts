import { HashGenerator } from "@/domain/club/cryptography/hash-generator";

export class FakeHashGenerator implements HashGenerator {
    generateHash(value: string): Promise<string> {
        return Promise.resolve(`hashed-${value}`);
    }
}

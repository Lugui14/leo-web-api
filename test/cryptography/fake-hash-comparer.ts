import { HashComparer } from "@/domain/club/cryptography/hash-comparer";

export class FakeHashComparer implements HashComparer {
    compare(password: string, hashedPassword: string): Promise<boolean> {
        return Promise.resolve(password === hashedPassword.replace("hashed-", ""));
    }
}

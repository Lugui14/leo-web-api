export abstract class Encrypter {
    abstract encrypt(value: object, expiresIn: string): string;

    abstract decrypt(value: string): object;
}

export abstract class Encrypter {
    abstract encrypt(value: object): string;

    abstract decrypt(value: string): object;
}

export abstract class Encrypter {
    abstract encrypt(value: object, expiresIn: string): Promise<string>;

    abstract decrypt(value: string): Promise<object>;
}

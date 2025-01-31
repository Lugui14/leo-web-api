export abstract class HashGenerator {
    abstract generateHash(value: string): Promise<string>;
}

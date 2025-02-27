import { CNPJ } from "./cnpj";

describe("CNPJ Value Object", () => {
    it("should create a valid CNPJ instance", () => {
        const cnpj = new CNPJ("12.345.678/0001-95");
        expect(cnpj.getValue()).toBe("12345678000195");
        expect(cnpj.format()).toBe("12.345.678/0001-95");
    });

    it("should throw an error for invalid CNPJ format", () => {
        expect(() => new CNPJ("123.456.789-00")).toThrow("Invalid CNPJ format");
        expect(() => new CNPJ("11111111111111")).toThrow("Invalid CNPJ format");
        expect(() => new CNPJ("")).toThrow("Invalid CNPJ format");
    });

    it("should sanitize input and validate correctly", () => {
        const cnpj = new CNPJ("12-345.678/0001-95");
        expect(cnpj.getValue()).toBe("12345678000195");
    });

    it("should validate CNPJ check digits correctly", () => {
        expect(() => new CNPJ("12.345.678/0001-00")).toThrow("Invalid CNPJ format");
        expect(() => new CNPJ("00.000.000/0000-00")).toThrow("Invalid CNPJ format");
    });
});

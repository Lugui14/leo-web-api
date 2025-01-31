import { InvalidCPFError } from "../errors/invalid-cpf-error";
import { CPF } from "./cpf";

describe("CPF value object test", () => {
    it("should create a valid CPF", () => {
        const cpf = new CPF("303.124.220-32");
        expect(cpf.value).toBe("303.124.220-32");
    });

    it("should throw an error for an invalid CPF", () => {
        expect(() => new CPF("123.456.789-00")).toThrow(InvalidCPFError);
        expect(() => new CPF("111.111.111-11")).toThrow(InvalidCPFError);
        expect(() => new CPF("123")).toThrow(InvalidCPFError);
        expect(() => new CPF("123.456.789-09123")).toThrow(InvalidCPFError);
    });
});

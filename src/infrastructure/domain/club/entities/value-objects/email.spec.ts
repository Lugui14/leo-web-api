import { InvalidEmailError } from "../errors/invalid-email-error";
import { Email } from "./email";

describe("Email value object test", () => {
    it("should create a valid email", () => {
        const email = new Email("test@example.com");
        expect(email.value).toBe("test@example.com");
    });

    it("should throw an error for an invalid email", () => {
        expect(() => new Email("invalid-email")).toThrow(InvalidEmailError);
        expect(() => new Email("test@example")).toThrow(InvalidEmailError);
        expect(() => new Email("test.example.com")).toThrow(InvalidEmailError);
    });
});

import { InvalidCNPJError } from "../errors/invalid-cnpj-error";

export class CNPJ {
    readonly value: string;

    constructor(value: string) {
        const sanitizedValue = CNPJ.sanitize(value);
        if (!CNPJ.isValid(sanitizedValue)) {
            throw new InvalidCNPJError();
        }
        this.value = sanitizedValue;
    }

    public static sanitize(value: string): string {
        return value.replace(/[\D]/g, "");
    }

    public static isValid(value: string): boolean {
        if (!/^[0-9]{14}$/.test(value)) return false;

        // Eliminate known invalid CNPJs
        if (/^([0-9])\1{13}$/.test(value)) return false;

        // Validation of verification digits
        const validateDigits = (cnpj: string, size: number): boolean => {
            const numbers = cnpj.substring(0, size);
            let sum = 0;
            let pos = size - 7;
            for (let i = size; i >= 1; i--) {
                sum += parseInt(numbers[size - i]) * pos--;
                if (pos < 2) pos = 9;
            }
            const result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
            return result === parseInt(cnpj[size]);
        };

        return validateDigits(value, 12) && validateDigits(value, 13);
    }

    public getValue(): string {
        return this.value;
    }

    public format(): string {
        return this.value.replace(/^([0-9]{2})([0-9]{3})([0-9]{3})([0-9]{4})([0-9]{2})$/, "$1.$2.$3/$4-$5");
    }
}

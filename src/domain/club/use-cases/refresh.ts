import { InvalidTokenError } from "./errors/invalid-token";
import { Either, left, right } from "@/core/either";
import { JWTPayloadProps } from "@/infrastructure/auth/current-user.dto";
import { PersonRepository } from "../repositories/person-repository";
import { Injectable } from "@nestjs/common";
import { Encrypter } from "../cryptography/encrypter";
import { ForbiddenPersonNotFoundError } from "./errors/person-not-found";

export interface RefreshUseCasePropsResponse {
    accessToken: string;
    refreshToken: string;
}

@Injectable()
export class RefreshUseCase {
    constructor(
        private personRepository: PersonRepository,
        private jwtEncrypter: Encrypter,
    ) {}

    async execute(
        refreshToken: string,
    ): Promise<Either<InvalidTokenError | ForbiddenPersonNotFoundError, RefreshUseCasePropsResponse>> {
        const payload = (await this.jwtEncrypter.decrypt(refreshToken)) as JWTPayloadProps;

        if (payload.type !== "refresh_token") return left(new InvalidTokenError("Invalid token type"));

        const person = await this.personRepository.findById(payload.sub);
        if (!person) return left(new ForbiddenPersonNotFoundError());

        if (person.refreshToken !== refreshToken) return left(new InvalidTokenError());

        const newPayload: Omit<JWTPayloadProps, "type"> = {
            sub: payload.sub,
            email: payload.email,
            roles: payload.roles,
        };

        const newAccessToken = await this.jwtEncrypter.encrypt({ ...newPayload, type: "access_token" }, "1h");
        const newRefreshToken = await this.jwtEncrypter.encrypt({ ...newPayload, type: "refresh_token" }, "1d");

        person.refreshToken = newRefreshToken;
        await this.personRepository.update(person);

        return right({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    }
}

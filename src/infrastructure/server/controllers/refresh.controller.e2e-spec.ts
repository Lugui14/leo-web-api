import { AppModule } from "@/app.module";
import { InvalidTokenError } from "@/domain/club/use-cases/errors/invalid-token";
import { PrismaModule } from "@/infrastructure/database/prisma.module";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { hash } from "bcrypt";
import { PersonFactory } from "@/../test/factories/make-person";
import { CPF } from "@/domain/club/entities/value-objects/cpf";
import * as request from "supertest";

interface AuthenticateResponse {
    accessToken: string;
    refreshToken: string;
}

describe("Refresh e2e", () => {
    let app: INestApplication;
    let personFactory: PersonFactory;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule, PrismaModule],
            providers: [PersonFactory],
        }).compile();

        app = module.createNestApplication();
        personFactory = module.get<PersonFactory>(PersonFactory);
        await app.init();
    });

    test("POST in /refresh (should return access and refresh token)", async () => {
        const savedPerson = await personFactory.makePrismaPerson({
            password: await hash("123456", 12),
            cpf: new CPF("620.741.640-68"),
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const authResponse = await request(app.getHttpServer()).post("/authenticate").send({
            email: savedPerson.email.value,
            password: "123456",
        });

        const authBody = authResponse.body as AuthenticateResponse;
        const refreshToken = authBody.refreshToken;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const refreshResponse = await request(app.getHttpServer()).post("/refresh").send({
            refresh_token: refreshToken,
        });

        const refreshBody = refreshResponse.body as AuthenticateResponse;

        expect(refreshResponse.status).toBe(HttpStatus.OK);
        expect(refreshBody.accessToken).toBeDefined();
        expect(refreshBody.refreshToken).toBeDefined();
    });

    test("POST in /refresh (should not reuse refresh token)", async () => {
        const savedPerson = await personFactory.makePrismaPerson({
            password: await hash("123456", 12),
            cpf: new CPF("604.916.380-43"),
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const authResponse = await request(app.getHttpServer()).post("/authenticate").send({
            email: savedPerson.email.value,
            password: "123456",
        });

        const authBody = authResponse.body as AuthenticateResponse;
        const refreshToken = authBody.refreshToken;

        const refreshTokenRequest = {
            refresh_token: refreshToken,
        };

        // time to jwt generate a different refresh token
        await new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        await request(app.getHttpServer()).post("/refresh").send(refreshTokenRequest);

        // time to jwt generate a different refresh token
        await new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const invalidAuthResponse = await request(app.getHttpServer()).post("/refresh").send(refreshTokenRequest);

        const invalidAuthBody = invalidAuthResponse.body as InvalidTokenError;

        expect(invalidAuthResponse.status).toBe(HttpStatus.UNAUTHORIZED);
        expect(invalidAuthBody.message).toBe("Invalid token");
    });

    test("POST in /refresh (should return jwt malformed)", async () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const response = await request(app.getHttpServer()).post("/refresh").send({
            refresh_token: "3ri92ur98234ur92",
        });

        const body = response.body as Error;

        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
        expect(body.message).toBe("jwt malformed");
    });
});

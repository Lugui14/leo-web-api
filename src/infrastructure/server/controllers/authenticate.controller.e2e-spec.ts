import { AppModule } from "@/app.module";
import { InvalidPasswordError } from "@/domain/club/use-cases/errors/invalid-password";
import { PersonNotFoundError } from "@/domain/club/use-cases/errors/person-not-found";
import { PrismaModule } from "@/infrastructure/database/prisma.module";
import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { hash } from "bcrypt";
import * as request from "supertest";
import { PersonFactory } from "@/../test/factories/make-person";
import { CPF } from "@/domain/club/entities/value-objects/cpf";

interface AuthenticateResponse {
    accessToken: string;
    refreshToken: string;
}

describe("Authenticate e2e", () => {
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

    test("POST in /authenticate (should return access and refresh token)", async () => {
        const savedPerson = await personFactory.makePrismaPerson({
            password: await hash("123456", 12),
            cpf: new CPF("440.936.940-79"),
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const response = await request(app.getHttpServer()).post("/authenticate").send({
            email: savedPerson.email.value,
            password: "123456",
        });

        const body = response.body as AuthenticateResponse;

        expect(response.status).toBe(HttpStatus.OK);
        expect(body.accessToken).toBeDefined();
        expect(body.refreshToken).toBeDefined();
    });

    test("POST in /authenticate (should return 403 person not found)", async () => {
        await personFactory.makePrismaPerson({ password: await hash("123456", 12), cpf: new CPF("331.509.940-55") });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const response = await request(app.getHttpServer()).post("/authenticate").send({
            email: "t@t.com",
            password: "123456",
        });

        const body = response.body as PersonNotFoundError;

        expect(response.status).toBe(HttpStatus.FORBIDDEN);
        expect(body.message).toBe("Invalid credentials");
    });

    test("POST in /authenticate (should return 403 invalid password)", async () => {
        const savedPerson = await personFactory.makePrismaPerson({
            password: await hash("123456", 12),
            cpf: new CPF("545.513.720-48"),
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const response = await request(app.getHttpServer()).post("/authenticate").send({
            email: savedPerson.email.value,
            password: "123457",
        });

        const body = response.body as InvalidPasswordError;

        expect(response.status).toBe(HttpStatus.FORBIDDEN);
        expect(body.message).toBe("Invalid credentials");
    });
});

import { AppModule } from "@/app.module";
import { PrismaModule } from "@/infrastructure/database/prisma.module";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PersonFactory } from "@/../test/factories/make-person";
import * as request from "supertest";
import { Person } from "@/domain/club/entities/person";
import { hash } from "bcrypt";
import { PersonAlreadyExists } from "@/domain/club/use-cases/errors/person-already-exists";
import { CPF } from "@/domain/club/entities/value-objects/cpf";

describe("SignUp e2e", () => {
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

    test("POST in /signup (should return 201)", async () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const response = await request(app.getHttpServer()).post("/signup").send({
            name: "test",
            email: "test@test.com",
            cpf: "158.492.310-56",
            birthdate: "1999-01-01",
            password: "123456",
        });

        const body = response.body as Omit<Person, "password">;

        expect(response.status).toBe(201);
        expect(body.name).toBe("test");
        expect(body.email).toBe("test@test.com");
        expect(body.cpf).toBe("158.492.310-56");
        expect(body.birthdate).toBe(new Date("1999-01-01").toISOString());
    });

    test("POST in /signup (should return 400 email already in use)", async () => {
        const savedPerson = await personFactory.makePrismaPerson({
            password: await hash("123456", 12),
            cpf: new CPF("577.614.210-56"),
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const response = await request(app.getHttpServer()).post("/signup").send({
            name: "test",
            email: savedPerson.email.value,
            cpf: "303.124.220-32",
            birthdate: "1999-01-01",
            password: "123456",
        });

        const body = response.body as PersonAlreadyExists;

        expect(response.status).toBe(400);
        expect(body.message).toBe("Person already exists");
    });
});

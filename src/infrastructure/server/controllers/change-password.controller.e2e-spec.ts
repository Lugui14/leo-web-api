import { AppModule } from "@/app.module";
import { PrismaModule } from "@/infrastructure/database/prisma.module";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PersonFactory } from "@/../test/factories/make-person";
import * as request from "supertest";
import { Person } from "@/domain/club/entities/person";
import { hash } from "bcrypt";
import { CPF } from "@/domain/club/entities/value-objects/cpf";
import { PersonNotFoundError } from "@/domain/club/use-cases/errors/person-not-found";
import { InvalidPasswordError } from "@/domain/club/use-cases/errors/invalid-password";
import { JwtService } from "@nestjs/jwt";
import { RoleEnum } from "@/domain/club/entities/enums/role";

describe("Change password e2e", () => {
    let app: INestApplication;
    let personFactory: PersonFactory;
    let jwtSerivce: JwtService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule, PrismaModule],
            providers: [PersonFactory],
        }).compile();

        app = module.createNestApplication();
        personFactory = module.get<PersonFactory>(PersonFactory);
        jwtSerivce = module.get<JwtService>(JwtService);
        await app.init();
    });

    test("POST in /change-passowrd (should return 200)", async () => {
        const savedPerson = await personFactory.makePrismaPerson({
            password: await hash("123456", 12),
            cpf: new CPF("345.297.800-15"),
        });

        const token = jwtSerivce.sign({
            sub: savedPerson.id,
            email: savedPerson.email.value,
            roles: [RoleEnum.ASSOCIATED],
            type: "access_token",
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const response = await request(app.getHttpServer())
            .post("/change-password")
            .set("Authorization", `Bearer ${token}`)
            .send({
                personId: savedPerson.id,
                oldPassword: "123456",
                newPassword: "1234567",
            });

        const body = response.body as Omit<Person, "password">;

        expect(response.status).toBe(200);
        expect(body.id).toBe(savedPerson.id);
        expect(body.name).toBe(savedPerson.name);
        expect(body.email).toBe(savedPerson.email.value);
    });

    test("POST in /change-password (should return 403 person not found)", async () => {
        const savedPerson = await personFactory.makePrismaPerson({
            password: await hash("123456", 12),
            cpf: new CPF("317.755.130-84"),
        });

        const token = jwtSerivce.sign({
            sub: savedPerson.id,
            email: savedPerson.email.value,
            roles: [RoleEnum.ASSOCIATED],
            type: "access_token",
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const response = await request(app.getHttpServer())
            .post("/change-password")
            .set("Authorization", `Bearer ${token}`)
            .send({
                personId: "1a",
                oldPassword: "123456",
                newPassword: "1234567",
            });

        const body = response.body as PersonNotFoundError;

        expect(response.status).toBe(403);
        expect(body.message).toBe("Invalid credentials");
    });

    test("POST in /change-password (should return 403 invalid password)", async () => {
        const savedPerson = await personFactory.makePrismaPerson({
            password: await hash("123456", 12),
            cpf: new CPF("312.887.960-56"),
        });

        const token = jwtSerivce.sign({
            sub: savedPerson.id,
            email: savedPerson.email.value,
            roles: [RoleEnum.ASSOCIATED],
            type: "access_token",
        });

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const response = await request(app.getHttpServer())
            .post("/change-password")
            .set("Authorization", `Bearer ${token}`)
            .send({
                personId: savedPerson.id,
                oldPassword: "1234567",
                newPassword: "12345678",
            });

        const body = response.body as InvalidPasswordError;

        expect(response.status).toBe(403);
        expect(body.message).toBe("Invalid credentials");
    });
});

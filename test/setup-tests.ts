import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import { config } from "dotenv";

config({
    path: ".env.test",
    override: true,
});

const prisma = new PrismaClient();

beforeAll(async () => {
    process.env = { ...process.env, NODE_ENV: "test" };

    await prisma.$connect();
    await prisma.$executeRawUnsafe("CREATE SCHEMA test");
    execSync("npx prisma migrate deploy");
});

afterAll(async () => {
    await prisma.$executeRawUnsafe("DROP SCHEMA IF EXISTS test CASCADE");
    await prisma.$disconnect();
});

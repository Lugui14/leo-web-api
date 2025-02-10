import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import { config } from "dotenv";

export default async function setup() {
    config({
        path: ".env.test",
        override: true,
    });

    console.log("Loading .env.test...");
    console.log("DATABASE_URL:", process.env.DATABASE_URL);

    const prisma = new PrismaClient();

    try {
        await prisma.$connect();
        await prisma.$executeRawUnsafe("CREATE SCHEMA IF NOT EXISTS test");
        console.log("✅ Test schema created.");

        console.log("Running Prisma migrations...");
        execSync("npx prisma migrate deploy", { stdio: "inherit" });
        execSync("npx prisma db seed", { stdio: "inherit" });
    } catch (error) {
        console.error("❌ Error during test setup:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

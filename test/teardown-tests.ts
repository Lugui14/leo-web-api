import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

export default async function teardown() {
    config({ path: ".env.test", override: true });

    console.log("🧹 Cleaning up test database...");

    const prisma = new PrismaClient();

    try {
        await prisma.$connect();
        await prisma.$executeRawUnsafe("DROP SCHEMA IF EXISTS test CASCADE");
        console.log("🗑️ Test schema dropped.");
    } catch (error) {
        console.error("❌ Error during test teardown:", error);
    } finally {
        await prisma.$disconnect();
    }
}

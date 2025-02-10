import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

beforeEach(async () => {
    await prisma.$transaction([prisma.monthlyFee.deleteMany(), prisma.person.deleteMany(), prisma.club.deleteMany()]);
});

afterAll(async () => {
    await prisma.$disconnect();
});

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    await prisma.role.upsert({
        where: { name: "PRE_LEO" },
        update: {},
        create: {
            name: "PRE_LEO",
        },
    });

    await prisma.role.upsert({
        where: { name: "ASSOCIATED" },
        update: {},
        create: {
            name: "ASSOCIATED",
        },
    });

    await prisma.role.upsert({
        where: { name: "TECHNICAL" },
        update: {},
        create: {
            name: "TECHNICAL",
        },
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

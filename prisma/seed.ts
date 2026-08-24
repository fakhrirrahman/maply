import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { UserRole, UserStatus } from "../src/models/enums.model";

const adminEmail = "admin@maply.com";
const adminPassword = "password";

async function main() {
    const passwordHash = await Bun.password.hash(adminPassword);

    const admin = await prisma.user.upsert({
        where: {
            email: adminEmail
        },
        update: {
            fullName: "Maply Admin",
            passwordHash,
            role: UserRole.ADMIN,
            status: UserStatus.ACTIVE
        },
        create: {
            fullName: "Maply Admin",
            email: adminEmail,
            passwordHash,
            role: UserRole.ADMIN,
            status: UserStatus.ACTIVE,
            registeredAt: new Date()
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            status: true
        }
    });

    console.log({
        message: "Seed completed",
        user: {
            ...admin,
            id: admin.id.toString()
        }
    });
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

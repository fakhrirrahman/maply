import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { UserRole, UserStatus, type UserRole as UserRoleType } from "../src/models/enums.model";

const superAdminEmail = "superadmin@maply.com";
const superAdminPassword = "password";
const adminEmail = "admin@maply.com";
const adminPassword = "password";

async function upsertSeedUser(input: {
    fullName: string;
    email: string;
    password: string;
    role: UserRoleType;
}) {
    const passwordHash = await Bun.password.hash(input.password);

    return prisma.user.upsert({
        where: {
            email: input.email
        },
        update: {
            fullName: input.fullName,
            passwordHash,
            role: input.role,
            status: UserStatus.ACTIVE
        },
        create: {
            fullName: input.fullName,
            email: input.email,
            passwordHash,
            role: input.role,
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
}

async function main() {
    const superAdmin = await upsertSeedUser({
        fullName: "Maply Super Admin",
        email: superAdminEmail,
        password: superAdminPassword,
        role: UserRole.SUPER_ADMIN
    });

    const admin = await upsertSeedUser({
        fullName: "Maply Admin",
        email: adminEmail,
        password: adminPassword,
        role: UserRole.ADMIN
    });

    console.log({
        message: "Seed completed",
        users: [
            {
                ...superAdmin,
                id: superAdmin.id.toString()
            },
            {
                ...admin,
                id: admin.id.toString()
            }
        ]
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

import { prisma } from "../lib/prisma";

export const authRepository = {
    findUserByEmail(email: string) {
        return prisma.user.findUnique({
            where: {
                email
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                passwordHash: true,
                role: true,
                status: true
            }
        });
    },

    updateLastLoginAt(userId: bigint) {
        return prisma.user.update({
            where: {
                id: userId
            },
            data: {
                lastLoginAt: new Date()
            },
            select: {
                id: true
            }
        });
    }
};

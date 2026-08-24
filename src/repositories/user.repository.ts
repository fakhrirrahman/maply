import { prisma } from "../lib/prisma";
import type { Prisma } from "../../generated/prisma/client";

const userSelect = {
    id: true,
    fullName: true,
    email: true,
    phone: true,
    role: true,
    status: true,
    country: true,
    address: true,
    registeredAt: true,
    lastLoginAt: true,
    createdAt: true,
    updatedAt: true
} satisfies Prisma.UserSelect;

export const userRepository = {
    findMany(skip: number, take: number) {
        return prisma.user.findMany({
            skip,
            take,
            orderBy: { createdAt: "desc" },
            select: userSelect
        });
    },

    count() {
        return prisma.user.count();
    },

    findById(id: bigint) {
        return prisma.user.findUnique({
            where: { id },
            select: userSelect
        });
    },

    create(data: Prisma.UserCreateInput) {
        return prisma.user.create({
            data,
            select: userSelect
        });
    },

    update(id: bigint, data: Prisma.UserUpdateInput) {
        return prisma.user.update({
            where: { id },
            data,
            select: userSelect
        });
    },

    delete(id: bigint) {
        return prisma.user.delete({
            where: { id },
            select: userSelect
        });
    }
};

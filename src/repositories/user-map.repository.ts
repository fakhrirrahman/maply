import { prisma } from "../lib/prisma";
import type { Prisma } from "../../generated/prisma/client";

const userMapInclude = {
    user: {
        select: { id: true, fullName: true, email: true, role: true, status: true }
    },
    locations: true
} satisfies Prisma.UserMapInclude;

export const userMapRepository = {
    findMany(skip: number, take: number) {
        return prisma.userMap.findMany({
            skip,
            take,
            orderBy: { createdAt: "desc" },
            include: userMapInclude
        });
    },

    count() {
        return prisma.userMap.count();
    },

    findById(id: bigint) {
        return prisma.userMap.findUnique({
            where: { id },
            include: userMapInclude
        });
    },

    create(data: Prisma.UserMapUncheckedCreateInput) {
        return prisma.userMap.create({ data, include: userMapInclude });
    },

    update(id: bigint, data: Prisma.UserMapUncheckedUpdateInput) {
        return prisma.userMap.update({ where: { id }, data, include: userMapInclude });
    },

    delete(id: bigint) {
        return prisma.userMap.delete({ where: { id }, include: userMapInclude });
    }
};

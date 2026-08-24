import { prisma } from "../lib/prisma";
import type { Prisma } from "../../generated/prisma/client";

export const userMapLocationRepository = {
    findMany(skip: number, take: number) {
        return prisma.userMapLocation.findMany({
            skip,
            take,
            orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
            include: { userMap: true }
        });
    },

    count() {
        return prisma.userMapLocation.count();
    },

    findById(id: bigint) {
        return prisma.userMapLocation.findUnique({
            where: { id },
            include: { userMap: true }
        });
    },

    create(data: Prisma.UserMapLocationUncheckedCreateInput) {
        return prisma.userMapLocation.create({ data, include: { userMap: true } });
    },

    update(id: bigint, data: Prisma.UserMapLocationUncheckedUpdateInput) {
        return prisma.userMapLocation.update({ where: { id }, data, include: { userMap: true } });
    },

    delete(id: bigint) {
        return prisma.userMapLocation.delete({ where: { id }, include: { userMap: true } });
    }
};

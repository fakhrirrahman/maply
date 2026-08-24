import { prisma } from "../lib/prisma";
import type { Prisma } from "../../generated/prisma/client";

export const priceRepository = {
    findMany(skip: number, take: number) {
        return prisma.price.findMany({
            skip,
            take,
            orderBy: { createdAt: "desc" }
        });
    },

    count() {
        return prisma.price.count();
    },

    findById(id: bigint) {
        return prisma.price.findUnique({ where: { id } });
    },

    create(data: Prisma.PriceCreateInput) {
        return prisma.price.create({ data });
    },

    update(id: bigint, data: Prisma.PriceUpdateInput) {
        return prisma.price.update({ where: { id }, data });
    },

    delete(id: bigint) {
        return prisma.price.delete({ where: { id } });
    }
};

import { prisma } from "../lib/prisma";
import type { Prisma } from "../../generated/prisma/client";

export const paymentMethodRepository = {
    findMany(skip: number, take: number) {
        return prisma.paymentMethod.findMany({
            skip,
            take,
            orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
        });
    },

    count() {
        return prisma.paymentMethod.count();
    },

    findById(id: bigint) {
        return prisma.paymentMethod.findUnique({ where: { id } });
    },

    create(data: Prisma.PaymentMethodCreateInput) {
        return prisma.paymentMethod.create({ data });
    },

    update(id: bigint, data: Prisma.PaymentMethodUpdateInput) {
        return prisma.paymentMethod.update({ where: { id }, data });
    },

    delete(id: bigint) {
        return prisma.paymentMethod.delete({ where: { id } });
    }
};

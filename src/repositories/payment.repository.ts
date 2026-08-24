import { prisma } from "../lib/prisma";
import type { Prisma } from "../../generated/prisma/client";

const paymentInclude = {
    transaction: true,
    paymentMethod: true
} satisfies Prisma.PaymentInclude;

export const paymentRepository = {
    findMany(skip: number, take: number) {
        return prisma.payment.findMany({
            skip,
            take,
            orderBy: { createdAt: "desc" },
            include: paymentInclude
        });
    },

    count() {
        return prisma.payment.count();
    },

    findById(id: bigint) {
        return prisma.payment.findUnique({
            where: { id },
            include: paymentInclude
        });
    },

    create(data: Prisma.PaymentUncheckedCreateInput) {
        return prisma.payment.create({ data, include: paymentInclude });
    },

    update(id: bigint, data: Prisma.PaymentUncheckedUpdateInput) {
        return prisma.payment.update({ where: { id }, data, include: paymentInclude });
    },

    delete(id: bigint) {
        return prisma.payment.delete({ where: { id }, include: paymentInclude });
    }
};

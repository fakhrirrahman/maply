import { prisma } from "../lib/prisma";
import type { Prisma } from "../../generated/prisma/client";

const transactionInclude = {
    card: true,
    user: {
        select: { id: true, fullName: true, email: true, role: true, status: true }
    },
    price: true
} satisfies Prisma.TransactionInclude;

export const transactionRepository = {
    findMany(skip: number, take: number) {
        return prisma.transaction.findMany({
            skip,
            take,
            orderBy: { createdAt: "desc" },
            include: transactionInclude
        });
    },

    count() {
        return prisma.transaction.count();
    },

    findById(id: bigint) {
        return prisma.transaction.findUnique({
            where: { id },
            include: transactionInclude
        });
    },

    create(data: Prisma.TransactionUncheckedCreateInput) {
        return prisma.transaction.create({ data, include: transactionInclude });
    },

    update(id: bigint, data: Prisma.TransactionUncheckedUpdateInput) {
        return prisma.transaction.update({ where: { id }, data, include: transactionInclude });
    },

    delete(id: bigint) {
        return prisma.transaction.delete({ where: { id }, include: transactionInclude });
    }
};

import { prisma } from "../lib/prisma";
import type { Prisma } from "../../generated/prisma/client";

const cardAssignmentInclude = {
    card: true,
    agent: {
        select: { id: true, fullName: true, email: true, role: true, status: true }
    },
    assignedByUser: {
        select: { id: true, fullName: true, email: true, role: true, status: true }
    }
} satisfies Prisma.CardAssignmentInclude;

export const cardAssignmentRepository = {
    findMany(skip: number, take: number) {
        return prisma.cardAssignment.findMany({
            skip,
            take,
            orderBy: { createdAt: "desc" },
            include: cardAssignmentInclude
        });
    },

    count() {
        return prisma.cardAssignment.count();
    },

    findById(id: bigint) {
        return prisma.cardAssignment.findUnique({
            where: { id },
            include: cardAssignmentInclude
        });
    },

    create(data: Prisma.CardAssignmentUncheckedCreateInput) {
        return prisma.cardAssignment.create({ data, include: cardAssignmentInclude });
    },

    update(id: bigint, data: Prisma.CardAssignmentUncheckedUpdateInput) {
        return prisma.cardAssignment.update({ where: { id }, data, include: cardAssignmentInclude });
    },

    delete(id: bigint) {
        return prisma.cardAssignment.delete({ where: { id }, include: cardAssignmentInclude });
    }
};

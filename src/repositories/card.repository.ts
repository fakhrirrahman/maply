import { prisma } from "../lib/prisma";
import type { Prisma } from "../../generated/prisma/client";

const cardInclude = {
    agent: {
        select: { id: true, fullName: true, email: true, role: true, status: true }
    },
    owner: {
        select: { id: true, fullName: true, email: true, role: true, status: true }
    }
} satisfies Prisma.CardInclude;

export const cardRepository = {
    findMany(skip: number, take: number) {
        return prisma.card.findMany({
            skip,
            take,
            orderBy: { createdAt: "desc" },
            include: cardInclude
        });
    },

    count() {
        return prisma.card.count();
    },

    findById(id: bigint) {
        return prisma.card.findUnique({
            where: { id },
            include: cardInclude
        });
    },

    findByQrToken(qrToken: string) {
        return prisma.card.findUnique({
            where: { qrToken },
            include: cardInclude
        });
    },

    findManyByAgent(agentId: bigint, skip: number, take: number) {
        return prisma.card.findMany({
            where: { agentId },
            skip,
            take,
            orderBy: { createdAt: "desc" },
            include: cardInclude
        });
    },

    countByAgent(agentId: bigint) {
        return prisma.card.count({
            where: { agentId }
        });
    },

    findManyByOwner(ownerId: bigint, skip: number, take: number) {
        return prisma.card.findMany({
            where: { ownerId },
            skip,
            take,
            orderBy: { createdAt: "desc" },
            include: cardInclude
        });
    },

    countByOwner(ownerId: bigint) {
        return prisma.card.count({
            where: { ownerId }
        });
    },

    findByIdAndOwner(id: bigint, ownerId: bigint) {
        return prisma.card.findFirst({
            where: { id, ownerId },
            include: cardInclude
        });
    },

    countActiveByOwner(ownerId: bigint) {
        return prisma.card.count({
            where: {
                ownerId,
                status: "ACTIVE"
            }
        });
    },

    create(data: Prisma.CardUncheckedCreateInput) {
        return prisma.card.create({ data, include: cardInclude });
    },

    update(id: bigint, data: Prisma.CardUncheckedUpdateInput) {
        return prisma.card.update({ where: { id }, data, include: cardInclude });
    },

    delete(id: bigint) {
        return prisma.card.delete({ where: { id }, include: cardInclude });
    }
};

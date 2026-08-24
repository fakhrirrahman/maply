import { prisma } from "../lib/prisma";
import type { Prisma } from "../../generated/prisma/client";

export const agentProfileRepository = {
    findMany(skip: number, take: number) {
        return prisma.agentProfile.findMany({
            skip,
            take,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: { id: true, fullName: true, email: true, role: true, status: true }
                }
            }
        });
    },

    count() {
        return prisma.agentProfile.count();
    },

    findById(id: bigint) {
        return prisma.agentProfile.findUnique({
            where: { id },
            include: {
                user: {
                    select: { id: true, fullName: true, email: true, role: true, status: true }
                }
            }
        });
    },

    create(data: Prisma.AgentProfileUncheckedCreateInput) {
        return prisma.agentProfile.create({ data });
    },

    update(id: bigint, data: Prisma.AgentProfileUncheckedUpdateInput) {
        return prisma.agentProfile.update({ where: { id }, data });
    },

    delete(id: bigint) {
        return prisma.agentProfile.delete({ where: { id } });
    }
};

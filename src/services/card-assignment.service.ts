import { AppError, HTTP_STATUS } from "../errors";
import type { CreateCardAssignmentBody, UpdateCardAssignmentBody } from "../models/card-assignment.model";
import { cardAssignmentRepository } from "../repositories/card-assignment.repository";
import { parseId, parsePagination, type PaginationQuery } from "../utils/request";
import { serializePrisma } from "../utils/serializer";

function mapCardAssignmentBody(body: CreateCardAssignmentBody | UpdateCardAssignmentBody) {
    return {
        ...body,
        cardId: body.cardId ? parseId(body.cardId, "cardId") : undefined,
        agentId: body.agentId ? parseId(body.agentId, "agentId") : undefined,
        assignedBy: body.assignedBy ? parseId(body.assignedBy, "assignedBy") : undefined,
        assignedAt: body.assignedAt ? new Date(body.assignedAt) : undefined,
        unassignedAt: body.unassignedAt === null || body.unassignedAt === undefined ? body.unassignedAt : new Date(body.unassignedAt)
    };
}

export const cardAssignmentService = {
    async list(query: PaginationQuery) {
        const { page, limit, skip } = parsePagination(query);
        const [items, total] = await Promise.all([
            cardAssignmentRepository.findMany(skip, limit),
            cardAssignmentRepository.count()
        ]);
        return { data: serializePrisma(items), page, limit, total };
    },

    async detail(id: string) {
        const item = await cardAssignmentRepository.findById(parseId(id));
        if (!item) throw new AppError("Card assignment not found", HTTP_STATUS.NOT_FOUND);
        return serializePrisma(item);
    },

    async create(body: CreateCardAssignmentBody) {
        return serializePrisma(await cardAssignmentRepository.create({
            cardId: parseId(body.cardId, "cardId"),
            agentId: parseId(body.agentId, "agentId"),
            assignedBy: parseId(body.assignedBy, "assignedBy"),
            status: body.status,
            assignedAt: body.assignedAt ? new Date(body.assignedAt) : undefined,
            unassignedAt: body.unassignedAt === null || body.unassignedAt === undefined ? body.unassignedAt : new Date(body.unassignedAt)
        }));
    },

    async update(id: string, body: UpdateCardAssignmentBody) {
        await this.detail(id);
        return serializePrisma(await cardAssignmentRepository.update(parseId(id), mapCardAssignmentBody(body)));
    },

    async delete(id: string) {
        await this.detail(id);
        return serializePrisma(await cardAssignmentRepository.delete(parseId(id)));
    }
};

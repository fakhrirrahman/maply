import { AppError, HTTP_STATUS } from "../errors";
import type { CreateCardBody, UpdateCardBody } from "../models/card.model";
import { cardRepository } from "../repositories/card.repository";
import { parseId, parsePagination, type PaginationQuery } from "../utils/request";
import { serializePrisma } from "../utils/serializer";

function nullableId(value?: string | null) {
    return value === null || value === undefined ? value : parseId(value);
}

function nullableDate(value?: string | null) {
    return value === null || value === undefined ? value : new Date(value);
}

function mapCardBody(body: CreateCardBody | UpdateCardBody) {
    return {
        ...body,
        agentId: nullableId(body.agentId),
        ownerId: nullableId(body.ownerId),
        registeredAt: nullableDate(body.registeredAt),
        activatedAt: nullableDate(body.activatedAt),
        expiredAt: nullableDate(body.expiredAt)
    };
}

export const cardService = {
    async list(query: PaginationQuery) {
        const { page, limit, skip } = parsePagination(query);
        const [items, total] = await Promise.all([cardRepository.findMany(skip, limit), cardRepository.count()]);
        return { data: serializePrisma(items), page, limit, total };
    },

    async detail(id: string) {
        const item = await cardRepository.findById(parseId(id));
        if (!item) throw new AppError("Card not found", HTTP_STATUS.NOT_FOUND);
        return serializePrisma(item);
    },

    async create(body: CreateCardBody) {
        return serializePrisma(await cardRepository.create({
            cardNumber: body.cardNumber,
            qrToken: body.qrToken,
            agentId: nullableId(body.agentId),
            ownerId: nullableId(body.ownerId),
            status: body.status,
            registeredAt: nullableDate(body.registeredAt),
            activatedAt: nullableDate(body.activatedAt),
            expiredAt: nullableDate(body.expiredAt)
        }));
    },

    async update(id: string, body: UpdateCardBody) {
        await this.detail(id);
        return serializePrisma(await cardRepository.update(parseId(id), mapCardBody(body)));
    },

    async delete(id: string) {
        await this.detail(id);
        return serializePrisma(await cardRepository.delete(parseId(id)));
    }
};

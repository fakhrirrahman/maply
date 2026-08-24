import { AppError, HTTP_STATUS } from "../errors";
import type { CreateTransactionBody, UpdateTransactionBody } from "../models/transaction.model";
import { transactionRepository } from "../repositories/transaction.repository";
import { parseId, parsePagination, type PaginationQuery } from "../utils/request";
import { serializePrisma } from "../utils/serializer";

function nullableDate(value?: string | null) {
    return value === null || value === undefined ? value : new Date(value);
}

function mapTransactionBody(body: CreateTransactionBody | UpdateTransactionBody) {
    return {
        ...body,
        cardId: body.cardId ? parseId(body.cardId, "cardId") : undefined,
        userId: body.userId ? parseId(body.userId, "userId") : undefined,
        priceId: body.priceId ? parseId(body.priceId, "priceId") : undefined,
        expiredAt: nullableDate(body.expiredAt),
        paidAt: nullableDate(body.paidAt)
    };
}

export const transactionService = {
    async list(query: PaginationQuery) {
        const { page, limit, skip } = parsePagination(query);
        const [items, total] = await Promise.all([
            transactionRepository.findMany(skip, limit),
            transactionRepository.count()
        ]);
        return { data: serializePrisma(items), page, limit, total };
    },

    async detail(id: string) {
        const item = await transactionRepository.findById(parseId(id));
        if (!item) throw new AppError("Transaction not found", HTTP_STATUS.NOT_FOUND);
        return serializePrisma(item);
    },

    async create(body: CreateTransactionBody) {
        return serializePrisma(await transactionRepository.create({
            transactionNumber: body.transactionNumber,
            cardId: parseId(body.cardId, "cardId"),
            userId: parseId(body.userId, "userId"),
            priceId: parseId(body.priceId, "priceId"),
            baseAmount: body.baseAmount,
            taxAmount: body.taxAmount,
            serviceFee: body.serviceFee,
            discountAmount: body.discountAmount,
            totalAmount: body.totalAmount,
            currency: body.currency,
            status: body.status,
            expiredAt: nullableDate(body.expiredAt),
            paidAt: nullableDate(body.paidAt)
        }));
    },

    async update(id: string, body: UpdateTransactionBody) {
        await this.detail(id);
        return serializePrisma(await transactionRepository.update(parseId(id), mapTransactionBody(body)));
    },

    async delete(id: string) {
        await this.detail(id);
        return serializePrisma(await transactionRepository.delete(parseId(id)));
    }
};

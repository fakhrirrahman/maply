import { AppError, HTTP_STATUS } from "../errors";
import type { CreatePriceBody, UpdatePriceBody } from "../models/price.model";
import { priceRepository } from "../repositories/price.repository";
import { parseId, parsePagination, type PaginationQuery } from "../utils/request";
import { serializePrisma } from "../utils/serializer";

function nullableDate(value?: string | null) {
    return value === null || value === undefined ? value : new Date(value);
}

function mapPriceBody(body: CreatePriceBody | UpdatePriceBody) {
    return {
        ...body,
        effectiveFrom: nullableDate(body.effectiveFrom),
        effectiveUntil: nullableDate(body.effectiveUntil)
    };
}

export const priceService = {
    async list(query: PaginationQuery) {
        const { page, limit, skip } = parsePagination(query);
        const [items, total] = await Promise.all([priceRepository.findMany(skip, limit), priceRepository.count()]);
        return { data: serializePrisma(items), page, limit, total };
    },

    async detail(id: string) {
        const item = await priceRepository.findById(parseId(id));
        if (!item) throw new AppError("Price not found", HTTP_STATUS.NOT_FOUND);
        return serializePrisma(item);
    },

    async create(body: CreatePriceBody) {
        return serializePrisma(await priceRepository.create({
            priceCode: body.priceCode,
            priceName: body.priceName,
            amount: body.amount,
            currency: body.currency,
            taxType: body.taxType,
            taxValue: body.taxValue,
            serviceFee: body.serviceFee,
            status: body.status,
            effectiveFrom: nullableDate(body.effectiveFrom),
            effectiveUntil: nullableDate(body.effectiveUntil)
        }));
    },

    async update(id: string, body: UpdatePriceBody) {
        await this.detail(id);
        return serializePrisma(await priceRepository.update(parseId(id), mapPriceBody(body)));
    },

    async delete(id: string) {
        await this.detail(id);
        return serializePrisma(await priceRepository.delete(parseId(id)));
    }
};

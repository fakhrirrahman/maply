import { AppError, HTTP_STATUS } from "../errors";
import type { CreatePaymentMethodBody, UpdatePaymentMethodBody } from "../models/payment-method.model";
import { paymentMethodRepository } from "../repositories/payment-method.repository";
import { parseId, parsePagination, type PaginationQuery } from "../utils/request";
import { serializePrisma } from "../utils/serializer";

export const paymentMethodService = {
    async list(query: PaginationQuery) {
        const { page, limit, skip } = parsePagination(query);
        const [items, total] = await Promise.all([
            paymentMethodRepository.findMany(skip, limit),
            paymentMethodRepository.count()
        ]);
        return { data: serializePrisma(items), page, limit, total };
    },

    async detail(id: string) {
        const item = await paymentMethodRepository.findById(parseId(id));
        if (!item) throw new AppError("Payment method not found", HTTP_STATUS.NOT_FOUND);
        return serializePrisma(item);
    },

    async create(body: CreatePaymentMethodBody) {
        return serializePrisma(await paymentMethodRepository.create(body));
    },

    async update(id: string, body: UpdatePaymentMethodBody) {
        await this.detail(id);
        return serializePrisma(await paymentMethodRepository.update(parseId(id), body));
    },

    async delete(id: string) {
        await this.detail(id);
        return serializePrisma(await paymentMethodRepository.delete(parseId(id)));
    }
};

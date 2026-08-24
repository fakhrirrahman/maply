import { AppError, HTTP_STATUS } from "../errors";
import type { CreatePaymentBody, UpdatePaymentBody } from "../models/payment.model";
import { paymentRepository } from "../repositories/payment.repository";
import { parseId, parsePagination, type PaginationQuery } from "../utils/request";
import { serializePrisma } from "../utils/serializer";

function nullableDate(value?: string | null) {
    return value === null || value === undefined ? value : new Date(value);
}

function mapPaymentBody(body: CreatePaymentBody | UpdatePaymentBody) {
    return {
        ...body,
        transactionId: body.transactionId ? parseId(body.transactionId, "transactionId") : undefined,
        paymentMethodId: body.paymentMethodId ? parseId(body.paymentMethodId, "paymentMethodId") : undefined,
        expiredAt: nullableDate(body.expiredAt),
        paidAt: nullableDate(body.paidAt)
    };
}

export const paymentService = {
    async list(query: PaginationQuery) {
        const { page, limit, skip } = parsePagination(query);
        const [items, total] = await Promise.all([paymentRepository.findMany(skip, limit), paymentRepository.count()]);
        return { data: serializePrisma(items), page, limit, total };
    },

    async detail(id: string) {
        const item = await paymentRepository.findById(parseId(id));
        if (!item) throw new AppError("Payment not found", HTTP_STATUS.NOT_FOUND);
        return serializePrisma(item);
    },

    async create(body: CreatePaymentBody) {
        return serializePrisma(await paymentRepository.create({
            transactionId: parseId(body.transactionId, "transactionId"),
            paymentMethodId: parseId(body.paymentMethodId, "paymentMethodId"),
            paymentProvider: body.paymentProvider,
            providerTransactionId: body.providerTransactionId,
            providerReference: body.providerReference,
            amount: body.amount,
            paymentFee: body.paymentFee,
            totalPaid: body.totalPaid,
            status: body.status,
            expiredAt: nullableDate(body.expiredAt),
            paidAt: nullableDate(body.paidAt)
        }));
    },

    async update(id: string, body: UpdatePaymentBody) {
        await this.detail(id);
        return serializePrisma(await paymentRepository.update(parseId(id), mapPaymentBody(body)));
    },

    async delete(id: string) {
        await this.detail(id);
        return serializePrisma(await paymentRepository.delete(parseId(id)));
    }
};

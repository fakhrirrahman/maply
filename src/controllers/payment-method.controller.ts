import type { IdParams, PaginationQuery } from "../models/common.model";
import type { CreatePaymentMethodBody, UpdatePaymentMethodBody } from "../models/payment-method.model";
import { paymentMethodService } from "../services/payment-method.service";
import { Response } from "../utils/response";

export const paymentMethodController = {
    async list({ query }: { query: PaginationQuery }) {
        const result = await paymentMethodService.list(query);
        return Response.paginated(result.data as unknown[], result.page, result.limit, result.total);
    },
    async detail({ params }: { params: IdParams }) {
        return Response.success(await paymentMethodService.detail(params.id));
    },
    async create({ body }: { body: CreatePaymentMethodBody }) {
        return Response.created(await paymentMethodService.create(body), "Payment method created successfully");
    },
    async update({ params, body }: { params: IdParams; body: UpdatePaymentMethodBody }) {
        return Response.success(await paymentMethodService.update(params.id, body), "Payment method updated successfully");
    },
    async delete({ params }: { params: IdParams }) {
        return Response.success(await paymentMethodService.delete(params.id), "Payment method deleted successfully");
    }
};

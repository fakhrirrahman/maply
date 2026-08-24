import type { IdParams, PaginationQuery } from "../models/common.model";
import type { CreatePaymentBody, UpdatePaymentBody } from "../models/payment.model";
import { paymentService } from "../services/payment.service";
import { Response } from "../utils/response";

export const paymentController = {
    async list({ query }: { query: PaginationQuery }) {
        const result = await paymentService.list(query);
        return Response.paginated(result.data as unknown[], result.page, result.limit, result.total);
    },
    async detail({ params }: { params: IdParams }) {
        return Response.success(await paymentService.detail(params.id));
    },
    async create({ body }: { body: CreatePaymentBody }) {
        return Response.created(await paymentService.create(body), "Payment created successfully");
    },
    async update({ params, body }: { params: IdParams; body: UpdatePaymentBody }) {
        return Response.success(await paymentService.update(params.id, body), "Payment updated successfully");
    },
    async delete({ params }: { params: IdParams }) {
        return Response.success(await paymentService.delete(params.id), "Payment deleted successfully");
    }
};

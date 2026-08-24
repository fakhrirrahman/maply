import type { IdParams, PaginationQuery } from "../models/common.model";
import type { CreateTransactionBody, MidtransChargeBody, UpdateTransactionBody } from "../models/transaction.model";
import { transactionService } from "../services/transaction.service";
import { Response } from "../utils/response";

export const transactionController = {
    async list({ query }: { query: PaginationQuery }) {
        const result = await transactionService.list(query);
        return Response.paginated(result.data as unknown[], result.page, result.limit, result.total);
    },
    async detail({ params }: { params: IdParams }) {
        return Response.success(await transactionService.detail(params.id));
    },
    async create({ body }: { body: CreateTransactionBody }) {
        return Response.created(await transactionService.create(body), "Transaction created successfully");
    },
    async update({ params, body }: { params: IdParams; body: UpdateTransactionBody }) {
        return Response.success(await transactionService.update(params.id, body), "Transaction updated successfully");
    },
    async delete({ params }: { params: IdParams }) {
        return Response.success(await transactionService.delete(params.id), "Transaction deleted successfully");
    },
    async chargeWithMidtrans({ params, body }: { params: IdParams; body: MidtransChargeBody }) {
        return Response.success(
            await transactionService.chargeWithMidtrans(params.id, body),
            "Midtrans charge created successfully"
        );
    }
};

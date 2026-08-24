import type { IdParams, PaginationQuery } from "../models/common.model";
import type { CreatePriceBody, UpdatePriceBody } from "../models/price.model";
import { priceService } from "../services/price.service";
import { Response } from "../utils/response";

export const priceController = {
    async list({ query }: { query: PaginationQuery }) {
        const result = await priceService.list(query);
        return Response.paginated(result.data as unknown[], result.page, result.limit, result.total);
    },
    async detail({ params }: { params: IdParams }) {
        return Response.success(await priceService.detail(params.id));
    },
    async create({ body }: { body: CreatePriceBody }) {
        return Response.created(await priceService.create(body), "Price created successfully");
    },
    async update({ params, body }: { params: IdParams; body: UpdatePriceBody }) {
        return Response.success(await priceService.update(params.id, body), "Price updated successfully");
    },
    async delete({ params }: { params: IdParams }) {
        return Response.success(await priceService.delete(params.id), "Price deleted successfully");
    }
};

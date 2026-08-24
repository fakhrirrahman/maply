import type { IdParams, PaginationQuery } from "../models/common.model";
import type { CreateCardBody, UpdateCardBody } from "../models/card.model";
import { cardService } from "../services/card.service";
import { Response } from "../utils/response";

export const cardController = {
    async list({ query }: { query: PaginationQuery }) {
        const result = await cardService.list(query);
        return Response.paginated(result.data as unknown[], result.page, result.limit, result.total);
    },
    async detail({ params }: { params: IdParams }) {
        return Response.success(await cardService.detail(params.id));
    },
    async create({ body }: { body: CreateCardBody }) {
        return Response.created(await cardService.create(body), "Card created successfully");
    },
    async update({ params, body }: { params: IdParams; body: UpdateCardBody }) {
        return Response.success(await cardService.update(params.id, body), "Card updated successfully");
    },
    async delete({ params }: { params: IdParams }) {
        return Response.success(await cardService.delete(params.id), "Card deleted successfully");
    }
};

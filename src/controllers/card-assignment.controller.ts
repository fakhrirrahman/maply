import type { IdParams, PaginationQuery } from "../models/common.model";
import type { CreateCardAssignmentBody, UpdateCardAssignmentBody } from "../models/card-assignment.model";
import { cardAssignmentService } from "../services/card-assignment.service";
import { Response } from "../utils/response";

export const cardAssignmentController = {
    async list({ query }: { query: PaginationQuery }) {
        const result = await cardAssignmentService.list(query);
        return Response.paginated(result.data as unknown[], result.page, result.limit, result.total);
    },
    async detail({ params }: { params: IdParams }) {
        return Response.success(await cardAssignmentService.detail(params.id));
    },
    async create({ body }: { body: CreateCardAssignmentBody }) {
        return Response.created(await cardAssignmentService.create(body), "Card assignment created successfully");
    },
    async update({ params, body }: { params: IdParams; body: UpdateCardAssignmentBody }) {
        return Response.success(await cardAssignmentService.update(params.id, body), "Card assignment updated successfully");
    },
    async delete({ params }: { params: IdParams }) {
        return Response.success(await cardAssignmentService.delete(params.id), "Card assignment deleted successfully");
    }
};

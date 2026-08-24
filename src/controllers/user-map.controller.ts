import type { IdParams, PaginationQuery } from "../models/common.model";
import type { CreateUserMapBody, UpdateUserMapBody } from "../models/user-map.model";
import { userMapService } from "../services/user-map.service";
import { Response } from "../utils/response";

export const userMapController = {
    async list({ query }: { query: PaginationQuery }) {
        const result = await userMapService.list(query);
        return Response.paginated(result.data as unknown[], result.page, result.limit, result.total);
    },
    async detail({ params }: { params: IdParams }) {
        return Response.success(await userMapService.detail(params.id));
    },
    async create({ body }: { body: CreateUserMapBody }) {
        return Response.created(await userMapService.create(body), "User map created successfully");
    },
    async update({ params, body }: { params: IdParams; body: UpdateUserMapBody }) {
        return Response.success(await userMapService.update(params.id, body), "User map updated successfully");
    },
    async delete({ params }: { params: IdParams }) {
        return Response.success(await userMapService.delete(params.id), "User map deleted successfully");
    }
};

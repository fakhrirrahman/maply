import type { IdParams, PaginationQuery } from "../models/common.model";
import type { CreateUserMapLocationBody, UpdateUserMapLocationBody } from "../models/user-map-location.model";
import { userMapLocationService } from "../services/user-map-location.service";
import { Response } from "../utils/response";

export const userMapLocationController = {
    async list({ query }: { query: PaginationQuery }) {
        const result = await userMapLocationService.list(query);
        return Response.paginated(result.data as unknown[], result.page, result.limit, result.total);
    },
    async detail({ params }: { params: IdParams }) {
        return Response.success(await userMapLocationService.detail(params.id));
    },
    async create({ body }: { body: CreateUserMapLocationBody }) {
        return Response.created(await userMapLocationService.create(body), "User map location created successfully");
    },
    async update({ params, body }: { params: IdParams; body: UpdateUserMapLocationBody }) {
        return Response.success(await userMapLocationService.update(params.id, body), "User map location updated successfully");
    },
    async delete({ params }: { params: IdParams }) {
        return Response.success(await userMapLocationService.delete(params.id), "User map location deleted successfully");
    }
};

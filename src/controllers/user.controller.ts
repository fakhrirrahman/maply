import type { IdParams, PaginationQuery } from "../models/common.model";
import type { CreateUserBody, UpdateUserBody } from "../models/user.model";
import { userService } from "../services/user.service";
import { Response } from "../utils/response";

export const userController = {
    async list({ query }: { query: PaginationQuery }) {
        const result = await userService.list(query);
        return Response.paginated(result.data as unknown[], result.page, result.limit, result.total);
    },

    async detail({ params }: { params: IdParams }) {
        return Response.success(await userService.detail(params.id));
    },

    async create({ body }: { body: CreateUserBody }) {
        return Response.created(await userService.create(body), "User created successfully");
    },

    async update({ params, body }: { params: IdParams; body: UpdateUserBody }) {
        return Response.success(await userService.update(params.id, body), "User updated successfully");
    },

    async delete({ params }: { params: IdParams }) {
        return Response.success(await userService.delete(params.id), "User deleted successfully");
    }
};

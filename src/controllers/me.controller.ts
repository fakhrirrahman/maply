import type { AuthUser } from "../middleware/jwt.middleware";
import type { IdParams, PaginationQuery } from "../models/common.model";
import type { CreateUserMapBody, UpdateUserMapBody } from "../models/user-map.model";
import { meService } from "../services/me.service";
import { Response } from "../utils/response";

type CreateMyMapBody = Omit<CreateUserMapBody, "userId">;

export const meController = {
    async listMaps({ user, query }: { user: AuthUser; query: PaginationQuery }) {
        const result = await meService.listMaps(user, query);
        return Response.paginated(result.data as unknown[], result.page, result.limit, result.total);
    },

    async detailMap({ user, params }: { user: AuthUser; params: IdParams }) {
        return Response.success(await meService.detailMap(user, params.id));
    },

    async createMap({ user, body }: { user: AuthUser; body: CreateMyMapBody }) {
        return Response.created(await meService.createMap(user, body), "User map created successfully");
    },

    async updateMap({ user, params, body }: { user: AuthUser; params: IdParams; body: UpdateUserMapBody }) {
        return Response.success(await meService.updateMap(user, params.id, body), "User map updated successfully");
    },

    async deleteMap({ user, params }: { user: AuthUser; params: IdParams }) {
        return Response.success(await meService.deleteMap(user, params.id), "User map deleted successfully");
    }
};

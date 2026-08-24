import { AppError, HTTP_STATUS } from "../errors";
import type { AuthUser } from "../middleware/jwt.middleware";
import type { CreateUserMapBody, UpdateUserMapBody } from "../models/user-map.model";
import { userMapRepository } from "../repositories/user-map.repository";
import { parseId, parsePagination, type PaginationQuery } from "../utils/request";
import { serializePrisma } from "../utils/serializer";

function mapUserMapBody(body: Omit<CreateUserMapBody, "userId"> | UpdateUserMapBody) {
    return {
        mapName: body.mapName,
        description: body.description,
        status: body.status
    };
}

export const meService = {
    async listMaps(user: AuthUser, query: PaginationQuery) {
        const userId = parseId(user.sub, "userId");
        const { page, limit, skip } = parsePagination(query);
        const [items, total] = await Promise.all([
            userMapRepository.findManyByUser(userId, skip, limit),
            userMapRepository.countByUser(userId)
        ]);

        return { data: serializePrisma(items), page, limit, total };
    },

    async detailMap(user: AuthUser, id: string) {
        const map = await userMapRepository.findByIdAndUser(parseId(id), parseId(user.sub, "userId"));

        if (!map) {
            throw new AppError("User map not found", HTTP_STATUS.NOT_FOUND);
        }

        return serializePrisma(map);
    },

    async createMap(user: AuthUser, body: Omit<CreateUserMapBody, "userId">) {
        return serializePrisma(await userMapRepository.create({
            ...mapUserMapBody(body),
            userId: parseId(user.sub, "userId")
        }));
    },

    async updateMap(user: AuthUser, id: string, body: UpdateUserMapBody) {
        await this.detailMap(user, id);
        return serializePrisma(await userMapRepository.update(parseId(id), mapUserMapBody(body)));
    },

    async deleteMap(user: AuthUser, id: string) {
        await this.detailMap(user, id);
        return serializePrisma(await userMapRepository.delete(parseId(id)));
    }
};

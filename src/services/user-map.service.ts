import { AppError, HTTP_STATUS } from "../errors";
import type { CreateUserMapBody, UpdateUserMapBody } from "../models/user-map.model";
import { userMapRepository } from "../repositories/user-map.repository";
import { parseId, parsePagination, type PaginationQuery } from "../utils/request";
import { serializePrisma } from "../utils/serializer";

function mapUserMapBody(body: CreateUserMapBody | UpdateUserMapBody) {
    return {
        ...body,
        userId: body.userId ? parseId(body.userId, "userId") : undefined
    };
}

export const userMapService = {
    async list(query: PaginationQuery) {
        const { page, limit, skip } = parsePagination(query);
        const [items, total] = await Promise.all([userMapRepository.findMany(skip, limit), userMapRepository.count()]);
        return { data: serializePrisma(items), page, limit, total };
    },

    async detail(id: string) {
        const item = await userMapRepository.findById(parseId(id));
        if (!item) throw new AppError("User map not found", HTTP_STATUS.NOT_FOUND);
        return serializePrisma(item);
    },

    async create(body: CreateUserMapBody) {
        return serializePrisma(await userMapRepository.create({
            userId: parseId(body.userId, "userId"),
            mapName: body.mapName,
            description: body.description,
            status: body.status
        }));
    },

    async update(id: string, body: UpdateUserMapBody) {
        await this.detail(id);
        return serializePrisma(await userMapRepository.update(parseId(id), mapUserMapBody(body)));
    },

    async delete(id: string) {
        await this.detail(id);
        return serializePrisma(await userMapRepository.delete(parseId(id)));
    }
};

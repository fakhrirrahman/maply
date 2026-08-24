import { AppError, HTTP_STATUS } from "../errors";
import type { CreateUserMapLocationBody, UpdateUserMapLocationBody } from "../models/user-map-location.model";
import { userMapLocationRepository } from "../repositories/user-map-location.repository";
import { parseId, parsePagination, type PaginationQuery } from "../utils/request";
import { serializePrisma } from "../utils/serializer";

function mapUserMapLocationBody(body: CreateUserMapLocationBody | UpdateUserMapLocationBody) {
    return {
        ...body,
        userMapId: body.userMapId ? parseId(body.userMapId, "userMapId") : undefined
    };
}

export const userMapLocationService = {
    async list(query: PaginationQuery) {
        const { page, limit, skip } = parsePagination(query);
        const [items, total] = await Promise.all([
            userMapLocationRepository.findMany(skip, limit),
            userMapLocationRepository.count()
        ]);
        return { data: serializePrisma(items), page, limit, total };
    },

    async detail(id: string) {
        const item = await userMapLocationRepository.findById(parseId(id));
        if (!item) throw new AppError("User map location not found", HTTP_STATUS.NOT_FOUND);
        return serializePrisma(item);
    },

    async create(body: CreateUserMapLocationBody) {
        return serializePrisma(await userMapLocationRepository.create({
            userMapId: parseId(body.userMapId, "userMapId"),
            provider: body.provider,
            providerPlaceId: body.providerPlaceId,
            locationName: body.locationName,
            latitude: body.latitude,
            longitude: body.longitude,
            address: body.address,
            category: body.category,
            note: body.note,
            sortOrder: body.sortOrder,
            status: body.status
        }));
    },

    async update(id: string, body: UpdateUserMapLocationBody) {
        await this.detail(id);
        return serializePrisma(await userMapLocationRepository.update(parseId(id), mapUserMapLocationBody(body)));
    },

    async delete(id: string) {
        await this.detail(id);
        return serializePrisma(await userMapLocationRepository.delete(parseId(id)));
    }
};

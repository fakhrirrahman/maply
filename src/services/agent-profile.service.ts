import { AppError, HTTP_STATUS } from "../errors";
import type { CreateAgentProfileBody, UpdateAgentProfileBody } from "../models/agent-profile.model";
import { agentProfileRepository } from "../repositories/agent-profile.repository";
import { parseId, parsePagination, type PaginationQuery } from "../utils/request";
import { serializePrisma } from "../utils/serializer";

function mapAgentProfileBody(body: CreateAgentProfileBody | UpdateAgentProfileBody) {
    return {
        ...body,
        userId: body.userId ? parseId(body.userId, "userId") : undefined
    };
}

export const agentProfileService = {
    async list(query: PaginationQuery) {
        const { page, limit, skip } = parsePagination(query);
        const [items, total] = await Promise.all([
            agentProfileRepository.findMany(skip, limit),
            agentProfileRepository.count()
        ]);
        return { data: serializePrisma(items), page, limit, total };
    },

    async detail(id: string) {
        const item = await agentProfileRepository.findById(parseId(id));
        if (!item) throw new AppError("Agent profile not found", HTTP_STATUS.NOT_FOUND);
        return serializePrisma(item);
    },

    async create(body: CreateAgentProfileBody) {
        return serializePrisma(await agentProfileRepository.create({
            userId: parseId(body.userId, "userId"),
            agentCode: body.agentCode,
            companyName: body.companyName,
            address: body.address
        }));
    },

    async update(id: string, body: UpdateAgentProfileBody) {
        await this.detail(id);
        return serializePrisma(await agentProfileRepository.update(parseId(id), mapAgentProfileBody(body)));
    },

    async delete(id: string) {
        await this.detail(id);
        return serializePrisma(await agentProfileRepository.delete(parseId(id)));
    }
};

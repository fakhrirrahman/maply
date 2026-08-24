import type { AuthUser } from "../middleware/jwt.middleware";
import { cardRepository } from "../repositories/card.repository";
import { parseId, parsePagination, type PaginationQuery } from "../utils/request";
import { serializePrisma } from "../utils/serializer";

export const agentService = {
    async listCards(user: AuthUser, query: PaginationQuery) {
        const agentId = parseId(user.sub, "userId");
        const { page, limit, skip } = parsePagination(query);
        const [items, total] = await Promise.all([
            cardRepository.findManyByAgent(agentId, skip, limit),
            cardRepository.countByAgent(agentId)
        ]);

        return { data: serializePrisma(items), page, limit, total };
    }
};

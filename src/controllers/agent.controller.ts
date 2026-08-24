import type { AuthUser } from "../middleware/jwt.middleware";
import type { PaginationQuery } from "../models/common.model";
import { agentService } from "../services/agent.service";
import { Response } from "../utils/response";

export const agentController = {
    async listCards({ user, query }: { user: AuthUser; query: PaginationQuery }) {
        const result = await agentService.listCards(user, query);
        return Response.paginated(result.data as unknown[], result.page, result.limit, result.total);
    }
};

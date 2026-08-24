import type { IdParams, PaginationQuery } from "../models/common.model";
import type { CreateAgentProfileBody, UpdateAgentProfileBody } from "../models/agent-profile.model";
import { agentProfileService } from "../services/agent-profile.service";
import { Response } from "../utils/response";

export const agentProfileController = {
    async list({ query }: { query: PaginationQuery }) {
        const result = await agentProfileService.list(query);
        return Response.paginated(result.data as unknown[], result.page, result.limit, result.total);
    },
    async detail({ params }: { params: IdParams }) {
        return Response.success(await agentProfileService.detail(params.id));
    },
    async create({ body }: { body: CreateAgentProfileBody }) {
        return Response.created(await agentProfileService.create(body), "Agent profile created successfully");
    },
    async update({ params, body }: { params: IdParams; body: UpdateAgentProfileBody }) {
        return Response.success(await agentProfileService.update(params.id, body), "Agent profile updated successfully");
    },
    async delete({ params }: { params: IdParams }) {
        return Response.success(await agentProfileService.delete(params.id), "Agent profile deleted successfully");
    }
};

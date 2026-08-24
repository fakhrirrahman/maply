import { Elysia } from "elysia";
import { agentProfileController } from "../controllers/agent-profile.controller";
import { errorResponseSchema, idParamsSchema, paginatedResponseSchema, paginationQuerySchema, successResponseSchema } from "../models/common.model";
import { createAgentProfileSchema, updateAgentProfileSchema } from "../models/agent-profile.model";
import { jwtMiddleware } from "../middleware/jwt.middleware";
import { ADMIN_ROLES } from "../models/enums.model";

export const agentProfileRoutes = new Elysia({ prefix: "/agent-profiles" })
    .use(jwtMiddleware)
    .get("/", agentProfileController.list, {
        auth: true,
        roles: [...ADMIN_ROLES],
        query: paginationQuerySchema,
        response: { 200: paginatedResponseSchema, 401: errorResponseSchema },
        detail: { tags: ["Agent Profiles"], summary: "List agent profiles", security: [{ bearerAuth: [] }] }
    })
    .get("/:id", agentProfileController.detail, {
        auth: true,
        roles: [...ADMIN_ROLES],
        params: idParamsSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema },
        detail: { tags: ["Agent Profiles"], summary: "Get agent profile detail", security: [{ bearerAuth: [] }] }
    })
    .post("/", agentProfileController.create, {
        auth: true,
        roles: [...ADMIN_ROLES],
        body: createAgentProfileSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 422: errorResponseSchema },
        detail: { tags: ["Agent Profiles"], summary: "Create agent profile", security: [{ bearerAuth: [] }] }
    })
    .patch("/:id", agentProfileController.update, {
        auth: true,
        roles: [...ADMIN_ROLES],
        params: idParamsSchema,
        body: updateAgentProfileSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema, 422: errorResponseSchema },
        detail: { tags: ["Agent Profiles"], summary: "Update agent profile", security: [{ bearerAuth: [] }] }
    })
    .delete("/:id", agentProfileController.delete, {
        auth: true,
        roles: [...ADMIN_ROLES],
        params: idParamsSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema },
        detail: { tags: ["Agent Profiles"], summary: "Delete agent profile", security: [{ bearerAuth: [] }] }
    });

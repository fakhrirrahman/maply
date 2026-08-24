import { Elysia } from "elysia";
import { agentController } from "../controllers/agent.controller";
import { jwtMiddleware } from "../middleware/jwt.middleware";
import { errorResponseSchema, paginatedResponseSchema, paginationQuerySchema } from "../models/common.model";
import { STAFF_ROLES } from "../models/enums.model";

export const agentRoutes = new Elysia({ prefix: "/agent" })
    .use(jwtMiddleware)
    .get("/cards", agentController.listCards, {
        auth: true,
        roles: [...STAFF_ROLES],
        query: paginationQuerySchema,
        response: { 200: paginatedResponseSchema, 401: errorResponseSchema, 403: errorResponseSchema },
        detail: {
            tags: ["Agent"],
            summary: "List cards assigned to current agent",
            security: [{ bearerAuth: [] }]
        }
    });

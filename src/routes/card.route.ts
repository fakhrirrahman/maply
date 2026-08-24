import { Elysia } from "elysia";
import { cardController } from "../controllers/card.controller";
import { errorResponseSchema, idParamsSchema, paginatedResponseSchema, paginationQuerySchema, successResponseSchema } from "../models/common.model";
import { createCardSchema, updateCardSchema } from "../models/card.model";
import { jwtMiddleware } from "../middleware/jwt.middleware";
import { ADMIN_ROLES } from "../models/enums.model";

export const cardRoutes = new Elysia({ prefix: "/cards" })
    .use(jwtMiddleware)
    .get("/", cardController.list, {
        auth: true,
        roles: [...ADMIN_ROLES],
        query: paginationQuerySchema,
        response: { 200: paginatedResponseSchema, 401: errorResponseSchema },
        detail: { tags: ["Cards"], summary: "List cards", security: [{ bearerAuth: [] }] }
    })
    .get("/:id", cardController.detail, {
        auth: true,
        roles: [...ADMIN_ROLES],
        params: idParamsSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema },
        detail: { tags: ["Cards"], summary: "Get card detail", security: [{ bearerAuth: [] }] }
    })
    .post("/", cardController.create, {
        auth: true,
        roles: [...ADMIN_ROLES],
        body: createCardSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 422: errorResponseSchema },
        detail: { tags: ["Cards"], summary: "Create card", security: [{ bearerAuth: [] }] }
    })
    .patch("/:id", cardController.update, {
        auth: true,
        roles: [...ADMIN_ROLES],
        params: idParamsSchema,
        body: updateCardSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema, 422: errorResponseSchema },
        detail: { tags: ["Cards"], summary: "Update card", security: [{ bearerAuth: [] }] }
    })
    .delete("/:id", cardController.delete, {
        auth: true,
        roles: [...ADMIN_ROLES],
        params: idParamsSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema },
        detail: { tags: ["Cards"], summary: "Delete card", security: [{ bearerAuth: [] }] }
    });

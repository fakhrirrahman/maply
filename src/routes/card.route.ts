import { Elysia } from "elysia";
import { cardController } from "../controllers/card.controller";
import { errorResponseSchema, idParamsSchema, paginatedResponseSchema, paginationQuerySchema, successResponseSchema } from "../models/common.model";
import { createCardSchema, updateCardSchema } from "../models/card.model";
import { jwtMiddleware } from "../middleware/jwt.middleware";

export const cardRoutes = new Elysia({ prefix: "/cards" })
    .use(jwtMiddleware)
    .get("/", cardController.list, {
        auth: true,
        query: paginationQuerySchema,
        response: { 200: paginatedResponseSchema, 401: errorResponseSchema },
        detail: { tags: ["Cards"], summary: "List cards", security: [{ bearerAuth: [] }] }
    })
    .get("/:id", cardController.detail, {
        auth: true,
        params: idParamsSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema },
        detail: { tags: ["Cards"], summary: "Get card detail", security: [{ bearerAuth: [] }] }
    })
    .post("/", cardController.create, {
        auth: true,
        body: createCardSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 422: errorResponseSchema },
        detail: { tags: ["Cards"], summary: "Create card", security: [{ bearerAuth: [] }] }
    })
    .patch("/:id", cardController.update, {
        auth: true,
        params: idParamsSchema,
        body: updateCardSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema, 422: errorResponseSchema },
        detail: { tags: ["Cards"], summary: "Update card", security: [{ bearerAuth: [] }] }
    })
    .delete("/:id", cardController.delete, {
        auth: true,
        params: idParamsSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema },
        detail: { tags: ["Cards"], summary: "Delete card", security: [{ bearerAuth: [] }] }
    });

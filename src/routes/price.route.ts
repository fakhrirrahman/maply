import { Elysia } from "elysia";
import { priceController } from "../controllers/price.controller";
import { errorResponseSchema, idParamsSchema, paginatedResponseSchema, paginationQuerySchema, successResponseSchema } from "../models/common.model";
import { createPriceSchema, updatePriceSchema } from "../models/price.model";
import { jwtMiddleware } from "../middleware/jwt.middleware";
import { ADMIN_ROLES } from "../models/enums.model";

export const priceRoutes = new Elysia({ prefix: "/prices" })
    .use(jwtMiddleware)
    .get("/", priceController.list, {
        auth: true,
        roles: [...ADMIN_ROLES],
        query: paginationQuerySchema,
        response: { 200: paginatedResponseSchema, 401: errorResponseSchema },
        detail: { tags: ["Prices"], summary: "List prices", security: [{ bearerAuth: [] }] }
    })
    .get("/:id", priceController.detail, {
        auth: true,
        roles: [...ADMIN_ROLES],
        params: idParamsSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema },
        detail: { tags: ["Prices"], summary: "Get price detail", security: [{ bearerAuth: [] }] }
    })
    .post("/", priceController.create, {
        auth: true,
        roles: [...ADMIN_ROLES],
        body: createPriceSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 422: errorResponseSchema },
        detail: { tags: ["Prices"], summary: "Create price", security: [{ bearerAuth: [] }] }
    })
    .patch("/:id", priceController.update, {
        auth: true,
        roles: [...ADMIN_ROLES],
        params: idParamsSchema,
        body: updatePriceSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema, 422: errorResponseSchema },
        detail: { tags: ["Prices"], summary: "Update price", security: [{ bearerAuth: [] }] }
    })
    .delete("/:id", priceController.delete, {
        auth: true,
        roles: [...ADMIN_ROLES],
        params: idParamsSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema },
        detail: { tags: ["Prices"], summary: "Delete price", security: [{ bearerAuth: [] }] }
    });

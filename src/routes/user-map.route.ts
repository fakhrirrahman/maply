import { Elysia } from "elysia";
import { userMapController } from "../controllers/user-map.controller";
import { errorResponseSchema, idParamsSchema, paginatedResponseSchema, paginationQuerySchema, successResponseSchema } from "../models/common.model";
import { createUserMapSchema, updateUserMapSchema } from "../models/user-map.model";
import { jwtMiddleware } from "../middleware/jwt.middleware";

export const userMapRoutes = new Elysia({ prefix: "/user-maps" })
    .use(jwtMiddleware)
    .get("/", userMapController.list, {
        auth: true,
        query: paginationQuerySchema,
        response: { 200: paginatedResponseSchema, 401: errorResponseSchema },
        detail: { tags: ["User Maps"], summary: "List user maps", security: [{ bearerAuth: [] }] }
    })
    .get("/:id", userMapController.detail, {
        auth: true,
        params: idParamsSchema,
        response: { 200: successResponseSchema, 400: errorResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema, 422: errorResponseSchema },
        detail: { tags: ["User Maps"], summary: "Get user map detail", security: [{ bearerAuth: [] }] }
    })
    .post("/", userMapController.create, {
        auth: true,
        body: createUserMapSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 422: errorResponseSchema },
        detail: { tags: ["User Maps"], summary: "Create user map", security: [{ bearerAuth: [] }] }
    })
    .patch("/:id", userMapController.update, {
        auth: true,
        params: idParamsSchema,
        body: updateUserMapSchema,
        response: { 200: successResponseSchema, 400: errorResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema, 422: errorResponseSchema },
        detail: { tags: ["User Maps"], summary: "Update user map", security: [{ bearerAuth: [] }] }
    })
    .delete("/:id", userMapController.delete, {
        auth: true,
        params: idParamsSchema,
        response: { 200: successResponseSchema, 400: errorResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema, 422: errorResponseSchema },
        detail: { tags: ["User Maps"], summary: "Delete user map", security: [{ bearerAuth: [] }] }
    });

import { Elysia } from "elysia";
import { userMapLocationController } from "../controllers/user-map-location.controller";
import { errorResponseSchema, idParamsSchema, paginatedResponseSchema, paginationQuerySchema, successResponseSchema } from "../models/common.model";
import { createUserMapLocationSchema, updateUserMapLocationSchema } from "../models/user-map-location.model";
import { jwtMiddleware } from "../middleware/jwt.middleware";

export const userMapLocationRoutes = new Elysia({ prefix: "/user-map-locations" })
    .use(jwtMiddleware)
    .get("/", userMapLocationController.list, {
        auth: true,
        query: paginationQuerySchema,
        response: { 200: paginatedResponseSchema, 401: errorResponseSchema },
        detail: { tags: ["User Map Locations"], summary: "List user map locations", security: [{ bearerAuth: [] }] }
    })
    .get("/:id", userMapLocationController.detail, {
        auth: true,
        params: idParamsSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema },
        detail: { tags: ["User Map Locations"], summary: "Get user map location detail", security: [{ bearerAuth: [] }] }
    })
    .post("/", userMapLocationController.create, {
        auth: true,
        body: createUserMapLocationSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 422: errorResponseSchema },
        detail: { tags: ["User Map Locations"], summary: "Create user map location", security: [{ bearerAuth: [] }] }
    })
    .patch("/:id", userMapLocationController.update, {
        auth: true,
        params: idParamsSchema,
        body: updateUserMapLocationSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema, 422: errorResponseSchema },
        detail: { tags: ["User Map Locations"], summary: "Update user map location", security: [{ bearerAuth: [] }] }
    })
    .delete("/:id", userMapLocationController.delete, {
        auth: true,
        params: idParamsSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema },
        detail: { tags: ["User Map Locations"], summary: "Delete user map location", security: [{ bearerAuth: [] }] }
    });

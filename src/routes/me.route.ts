import { Elysia, t } from "elysia";
import { meController } from "../controllers/me.controller";
import { jwtMiddleware } from "../middleware/jwt.middleware";
import { errorResponseSchema, idParamsSchema, paginatedResponseSchema, paginationQuerySchema, successResponseSchema } from "../models/common.model";
import { UserRole } from "../models/enums.model";
import { updateUserMapSchema } from "../models/user-map.model";

const createMyMapSchema = t.Object({
    mapName: t.Optional(t.String({ minLength: 1 })),
    description: t.Optional(t.Nullable(t.String())),
    status: t.Optional(t.Union([t.Literal("ACTIVE"), t.Literal("INACTIVE")]))
});

export const meRoutes = new Elysia({ prefix: "/me" })
    .use(jwtMiddleware)
    .get("/maps", meController.listMaps, {
        auth: true,
        roles: [UserRole.USER],
        query: paginationQuerySchema,
        response: { 200: paginatedResponseSchema, 401: errorResponseSchema, 403: errorResponseSchema },
        detail: { tags: ["Me"], summary: "List current user maps", security: [{ bearerAuth: [] }] }
    })
    .get("/maps/:id", meController.detailMap, {
        auth: true,
        roles: [UserRole.USER],
        params: idParamsSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 403: errorResponseSchema, 404: errorResponseSchema },
        detail: { tags: ["Me"], summary: "Get current user map detail", security: [{ bearerAuth: [] }] }
    })
    .post("/maps", meController.createMap, {
        auth: true,
        roles: [UserRole.USER],
        body: createMyMapSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 403: errorResponseSchema, 422: errorResponseSchema },
        detail: { tags: ["Me"], summary: "Create current user map", security: [{ bearerAuth: [] }] }
    })
    .patch("/maps/:id", meController.updateMap, {
        auth: true,
        roles: [UserRole.USER],
        params: idParamsSchema,
        body: updateUserMapSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 403: errorResponseSchema, 404: errorResponseSchema, 422: errorResponseSchema },
        detail: { tags: ["Me"], summary: "Update current user map", security: [{ bearerAuth: [] }] }
    })
    .delete("/maps/:id", meController.deleteMap, {
        auth: true,
        roles: [UserRole.USER],
        params: idParamsSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 403: errorResponseSchema, 404: errorResponseSchema },
        detail: { tags: ["Me"], summary: "Delete current user map", security: [{ bearerAuth: [] }] }
    });

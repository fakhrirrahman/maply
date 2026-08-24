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

const checkoutMyCardSchema = t.Object({
    priceId: t.String({ pattern: "^\\d+$" }),
    paymentMethodId: t.String({ pattern: "^\\d+$" }),
    paymentType: t.Optional(t.Union([
        t.Literal("bank_transfer"),
        t.Literal("echannel"),
        t.Literal("qris")
    ])),
    bank: t.Optional(t.Union([
        t.Literal("bca"),
        t.Literal("bni"),
        t.Literal("bri"),
        t.Literal("permata"),
        t.Literal("cimb"),
        t.Literal("mandiri"),
        t.Literal("qris")
    ])),
    acquirer: t.Optional(t.Union([
        t.Literal("gopay"),
        t.Literal("airpay shopee")
    ])),
    vaNumber: t.Optional(t.String({ pattern: "^\\d+$" }))
});

export const meRoutes = new Elysia({ prefix: "/me" })
    .use(jwtMiddleware)
    .get("/cards", meController.listCards, {
        auth: true,
        roles: [UserRole.USER],
        query: paginationQuerySchema,
        response: { 200: paginatedResponseSchema, 401: errorResponseSchema, 403: errorResponseSchema },
        detail: { tags: ["Me"], summary: "List current user cards", security: [{ bearerAuth: [] }] }
    })
    .post("/cards/:id/checkout", meController.checkoutCard, {
        auth: true,
        roles: [UserRole.USER],
        params: idParamsSchema,
        body: checkoutMyCardSchema,
        response: { 200: successResponseSchema, 400: errorResponseSchema, 401: errorResponseSchema, 403: errorResponseSchema, 404: errorResponseSchema, 422: errorResponseSchema },
        detail: {
            tags: ["Me"],
            summary: "Checkout current user card",
            description: "Creates a transaction for the current user's registered card and charges Midtrans Core API.",
            security: [{ bearerAuth: [] }]
        }
    })
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

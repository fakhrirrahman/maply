import { Elysia } from "elysia";
import { publicController } from "../controllers/public.controller";
import { errorResponseSchema, successResponseSchema } from "../models/common.model";
import { qrTokenParamsSchema, registerQrCardSchema } from "../models/public.model";

export const publicRoutes = new Elysia({ prefix: "/public" })
    .get("/cards/:qrToken", publicController.lookupCard, {
        params: qrTokenParamsSchema,
        response: { 200: successResponseSchema, 404: errorResponseSchema },
        detail: {
            tags: ["Public"],
            summary: "Lookup card by QR token",
            security: []
        }
    })
    .post("/cards/:qrToken/register", publicController.registerCard, {
        params: qrTokenParamsSchema,
        body: registerQrCardSchema,
        response: { 200: successResponseSchema, 400: errorResponseSchema, 404: errorResponseSchema, 422: errorResponseSchema },
        detail: {
            tags: ["Public"],
            summary: "Register user by QR card",
            security: []
        }
    })
    .get("/cards/:qrToken/map", publicController.getPublicMap, {
        params: qrTokenParamsSchema,
        response: { 200: successResponseSchema, 403: errorResponseSchema, 404: errorResponseSchema },
        detail: {
            tags: ["Public"],
            summary: "Get public map by QR token",
            security: []
        }
    });

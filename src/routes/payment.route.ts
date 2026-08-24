import { Elysia } from "elysia";
import { paymentController } from "../controllers/payment.controller";
import { errorResponseSchema, idParamsSchema, paginatedResponseSchema, paginationQuerySchema, successResponseSchema } from "../models/common.model";
import { createPaymentSchema, updatePaymentSchema } from "../models/payment.model";
import { jwtMiddleware } from "../middleware/jwt.middleware";

export const paymentRoutes = new Elysia({ prefix: "/payments" })
    .use(jwtMiddleware)
    .get("/", paymentController.list, {
        auth: true,
        query: paginationQuerySchema,
        response: { 200: paginatedResponseSchema, 401: errorResponseSchema },
        detail: { tags: ["Payments"], summary: "List payments", security: [{ bearerAuth: [] }] }
    })
    .get("/:id", paymentController.detail, {
        auth: true,
        params: idParamsSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema },
        detail: { tags: ["Payments"], summary: "Get payment detail", security: [{ bearerAuth: [] }] }
    })
    .post("/", paymentController.create, {
        auth: true,
        body: createPaymentSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 422: errorResponseSchema },
        detail: { tags: ["Payments"], summary: "Create payment", security: [{ bearerAuth: [] }] }
    })
    .patch("/:id", paymentController.update, {
        auth: true,
        params: idParamsSchema,
        body: updatePaymentSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema, 422: errorResponseSchema },
        detail: { tags: ["Payments"], summary: "Update payment", security: [{ bearerAuth: [] }] }
    })
    .delete("/:id", paymentController.delete, {
        auth: true,
        params: idParamsSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema },
        detail: { tags: ["Payments"], summary: "Delete payment", security: [{ bearerAuth: [] }] }
    });

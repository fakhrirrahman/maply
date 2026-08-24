import { Elysia } from "elysia";
import { paymentMethodController } from "../controllers/payment-method.controller";
import { errorResponseSchema, idParamsSchema, paginatedResponseSchema, paginationQuerySchema, successResponseSchema } from "../models/common.model";
import { createPaymentMethodSchema, updatePaymentMethodSchema } from "../models/payment-method.model";
import { jwtMiddleware } from "../middleware/jwt.middleware";

export const paymentMethodRoutes = new Elysia({ prefix: "/payment-methods" })
    .use(jwtMiddleware)
    .get("/", paymentMethodController.list, {
        auth: true,
        query: paginationQuerySchema,
        response: { 200: paginatedResponseSchema, 401: errorResponseSchema },
        detail: { tags: ["Payment Methods"], summary: "List payment methods", security: [{ bearerAuth: [] }] }
    })
    .get("/:id", paymentMethodController.detail, {
        auth: true,
        params: idParamsSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema },
        detail: { tags: ["Payment Methods"], summary: "Get payment method detail", security: [{ bearerAuth: [] }] }
    })
    .post("/", paymentMethodController.create, {
        auth: true,
        body: createPaymentMethodSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 422: errorResponseSchema },
        detail: { tags: ["Payment Methods"], summary: "Create payment method", security: [{ bearerAuth: [] }] }
    })
    .patch("/:id", paymentMethodController.update, {
        auth: true,
        params: idParamsSchema,
        body: updatePaymentMethodSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema, 422: errorResponseSchema },
        detail: { tags: ["Payment Methods"], summary: "Update payment method", security: [{ bearerAuth: [] }] }
    })
    .delete("/:id", paymentMethodController.delete, {
        auth: true,
        params: idParamsSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema },
        detail: { tags: ["Payment Methods"], summary: "Delete payment method", security: [{ bearerAuth: [] }] }
    });

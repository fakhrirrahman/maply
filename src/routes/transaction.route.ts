import { Elysia } from "elysia";
import { transactionController } from "../controllers/transaction.controller";
import { errorResponseSchema, idParamsSchema, paginatedResponseSchema, paginationQuerySchema, successResponseSchema } from "../models/common.model";
import { createTransactionSchema, updateTransactionSchema } from "../models/transaction.model";
import { jwtMiddleware } from "../middleware/jwt.middleware";

export const transactionRoutes = new Elysia({ prefix: "/transactions" })
    .use(jwtMiddleware)
    .get("/", transactionController.list, {
        auth: true,
        query: paginationQuerySchema,
        response: { 200: paginatedResponseSchema, 401: errorResponseSchema },
        detail: { tags: ["Transactions"], summary: "List transactions", security: [{ bearerAuth: [] }] }
    })
    .get("/:id", transactionController.detail, {
        auth: true,
        params: idParamsSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema },
        detail: { tags: ["Transactions"], summary: "Get transaction detail", security: [{ bearerAuth: [] }] }
    })
    .post("/", transactionController.create, {
        auth: true,
        body: createTransactionSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 422: errorResponseSchema },
        detail: { tags: ["Transactions"], summary: "Create transaction", security: [{ bearerAuth: [] }] }
    })
    .patch("/:id", transactionController.update, {
        auth: true,
        params: idParamsSchema,
        body: updateTransactionSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema, 422: errorResponseSchema },
        detail: { tags: ["Transactions"], summary: "Update transaction", security: [{ bearerAuth: [] }] }
    })
    .delete("/:id", transactionController.delete, {
        auth: true,
        params: idParamsSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema },
        detail: { tags: ["Transactions"], summary: "Delete transaction", security: [{ bearerAuth: [] }] }
    });

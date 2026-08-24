import { Elysia } from "elysia";
import { transactionController } from "../controllers/transaction.controller";
import { errorResponseSchema, idParamsSchema, paginatedResponseSchema, paginationQuerySchema, successResponseSchema } from "../models/common.model";
import { createTransactionSchema, midtransChargeSchema, updateTransactionSchema } from "../models/transaction.model";
import { jwtMiddleware } from "../middleware/jwt.middleware";
import { ADMIN_ROLES } from "../models/enums.model";

export const transactionRoutes = new Elysia({ prefix: "/transactions" })
    .use(jwtMiddleware)
    .get("/", transactionController.list, {
        auth: true,
        roles: [...ADMIN_ROLES],
        query: paginationQuerySchema,
        response: { 200: paginatedResponseSchema, 401: errorResponseSchema },
        detail: { tags: ["Transactions"], summary: "List transactions", security: [{ bearerAuth: [] }] }
    })
    .get("/:id", transactionController.detail, {
        auth: true,
        roles: [...ADMIN_ROLES],
        params: idParamsSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema },
        detail: { tags: ["Transactions"], summary: "Get transaction detail", security: [{ bearerAuth: [] }] }
    })
    .post("/", transactionController.create, {
        auth: true,
        roles: [...ADMIN_ROLES],
        body: createTransactionSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 422: errorResponseSchema },
        detail: { tags: ["Transactions"], summary: "Create transaction", security: [{ bearerAuth: [] }] }
    })
    .post("/:id/midtrans/charge", transactionController.chargeWithMidtrans, {
        auth: true,
        roles: [...ADMIN_ROLES],
        params: idParamsSchema,
        body: midtransChargeSchema,
        response: { 200: successResponseSchema, 400: errorResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema, 422: errorResponseSchema },
        detail: {
            tags: ["Transactions"],
            summary: "Charge transaction with Midtrans Core API",
            description: "Creates a Midtrans Core API charge for the selected transaction and stores the resulting payment record.",
            security: [{ bearerAuth: [] }]
        }
    })
    .patch("/:id", transactionController.update, {
        auth: true,
        roles: [...ADMIN_ROLES],
        params: idParamsSchema,
        body: updateTransactionSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema, 422: errorResponseSchema },
        detail: { tags: ["Transactions"], summary: "Update transaction", security: [{ bearerAuth: [] }] }
    })
    .delete("/:id", transactionController.delete, {
        auth: true,
        roles: [...ADMIN_ROLES],
        params: idParamsSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema },
        detail: { tags: ["Transactions"], summary: "Delete transaction", security: [{ bearerAuth: [] }] }
    });

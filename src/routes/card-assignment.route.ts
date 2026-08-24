import { Elysia } from "elysia";
import { cardAssignmentController } from "../controllers/card-assignment.controller";
import { errorResponseSchema, idParamsSchema, paginatedResponseSchema, paginationQuerySchema, successResponseSchema } from "../models/common.model";
import { createCardAssignmentSchema, updateCardAssignmentSchema } from "../models/card-assignment.model";
import { jwtMiddleware } from "../middleware/jwt.middleware";

export const cardAssignmentRoutes = new Elysia({ prefix: "/card-assignments" })
    .use(jwtMiddleware)
    .get("/", cardAssignmentController.list, {
        auth: true,
        query: paginationQuerySchema,
        response: { 200: paginatedResponseSchema, 401: errorResponseSchema },
        detail: { tags: ["Card Assignments"], summary: "List card assignments", security: [{ bearerAuth: [] }] }
    })
    .get("/:id", cardAssignmentController.detail, {
        auth: true,
        params: idParamsSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema },
        detail: { tags: ["Card Assignments"], summary: "Get card assignment detail", security: [{ bearerAuth: [] }] }
    })
    .post("/", cardAssignmentController.create, {
        auth: true,
        body: createCardAssignmentSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 422: errorResponseSchema },
        detail: { tags: ["Card Assignments"], summary: "Create card assignment", security: [{ bearerAuth: [] }] }
    })
    .patch("/:id", cardAssignmentController.update, {
        auth: true,
        params: idParamsSchema,
        body: updateCardAssignmentSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema, 422: errorResponseSchema },
        detail: { tags: ["Card Assignments"], summary: "Update card assignment", security: [{ bearerAuth: [] }] }
    })
    .delete("/:id", cardAssignmentController.delete, {
        auth: true,
        params: idParamsSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema },
        detail: { tags: ["Card Assignments"], summary: "Delete card assignment", security: [{ bearerAuth: [] }] }
    });

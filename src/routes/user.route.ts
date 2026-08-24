import { Elysia } from "elysia";
import { userController } from "../controllers/user.controller";
import { errorResponseSchema, idParamsSchema, paginatedResponseSchema, paginationQuerySchema, successResponseSchema } from "../models/common.model";
import { createUserSchema, updateUserSchema } from "../models/user.model";
import { jwtMiddleware } from "../middleware/jwt.middleware";

export const userRoutes = new Elysia({ prefix: "/users" })
    .use(jwtMiddleware)
    .get("/", userController.list, {
        auth: true,
        query: paginationQuerySchema,
        response: { 200: paginatedResponseSchema, 401: errorResponseSchema },
        detail: { tags: ["Users"], summary: "List users", security: [{ bearerAuth: [] }] }
    })
    .get("/:id", userController.detail, {
        auth: true,
        params: idParamsSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema },
        detail: { tags: ["Users"], summary: "Get user detail", security: [{ bearerAuth: [] }] }
    })
    .post("/", userController.create, {
        auth: true,
        body: createUserSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 422: errorResponseSchema },
        detail: { tags: ["Users"], summary: "Create user", security: [{ bearerAuth: [] }] }
    })
    .patch("/:id", userController.update, {
        auth: true,
        params: idParamsSchema,
        body: updateUserSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema, 422: errorResponseSchema },
        detail: { tags: ["Users"], summary: "Update user", security: [{ bearerAuth: [] }] }
    })
    .delete("/:id", userController.delete, {
        auth: true,
        params: idParamsSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema },
        detail: { tags: ["Users"], summary: "Delete user", security: [{ bearerAuth: [] }] }
    });

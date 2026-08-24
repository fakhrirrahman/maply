import { Elysia } from "elysia";
import { jwtMiddleware } from "../middleware/jwt.middleware";
import { authController } from "../controllers/auth.controller";
import {
    authErrorResponseSchema,
    loginBodySchema,
    loginResponseSchema
} from "../models/auth.model";

export const authRoutes = new Elysia({
    prefix: "/auth"
})
    .use(jwtMiddleware)
    .post(
        "/login",
        authController.login,
        {
            body: loginBodySchema,
            response: {
                200: loginResponseSchema,
                401: authErrorResponseSchema,
                403: authErrorResponseSchema,
                422: authErrorResponseSchema
            },
            detail: {
                tags: ["Auth"],
                summary: "Login",
                description: "Authenticate an active user with email and password, then return safe user data and a JWT access token.",
                security: []
            }
        }
    );

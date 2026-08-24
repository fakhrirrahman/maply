import { Elysia, t } from "elysia";
import { jwtMiddleware } from "../middleware/jwt.middleware";
import { authController } from "../controllers/auth.controller";
import { loginBodySchema, loginResponseSchema } from "../models/auth.model";

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
                401: t.Object({
                    success: t.Boolean(),
                    message: t.String(),
                    errors: t.Nullable(t.Unknown())
                }),
                403: t.Object({
                    success: t.Boolean(),
                    message: t.String(),
                    errors: t.Nullable(t.Unknown())
                }),
                422: t.Object({
                    success: t.Boolean(),
                    message: t.String(),
                    errors: t.Nullable(t.Unknown())
                })
            },
            detail: {
                tags: ["Auth"],
                summary: "Login",
                description: "Authenticate a user with email and password, then return user data and JWT access token."
            }
        }
    );

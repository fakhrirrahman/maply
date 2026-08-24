import { Elysia, t } from "elysia";
import { jwtMiddleware } from "../middleware/jwt.middleware";
import { authController } from "../controllers/auth.controller";

export const authRoutes = new Elysia({
    prefix: "/auth"
})
    .use(jwtMiddleware)
    .post(
        "/login",
        authController.login,
        {
            body: t.Object({
                userId: t.String({
                    minLength: 1
                }),
                email: t.Optional(t.String({
                    format: "email"
                })),
                name: t.Optional(t.String())
            })
        }
    )
    .get("/me", authController.me);

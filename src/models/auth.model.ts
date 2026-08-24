import { t } from "elysia";
import { UserRole } from "./enums.model";

export const loginBodySchema = t.Object({
    email: t.String({
        format: "email",
        examples: ["admin@maply.com"]
    }),
    password: t.String({
        minLength: 1,
        examples: ["password"]
    })
});

export const loginResponseSchema = t.Object({
    success: t.Boolean(),
    message: t.String(),
    data: t.Object({
        user: t.Object({
            id: t.String(),
            fullName: t.String(),
            email: t.String(),
            role: t.Enum(UserRole)
        }),
        accessToken: t.String()
    })
});

export const authErrorResponseSchema = t.Object({
    success: t.Boolean(),
    message: t.String(),
    errors: t.Nullable(t.Unknown())
});

export type LoginBody = typeof loginBodySchema.static;

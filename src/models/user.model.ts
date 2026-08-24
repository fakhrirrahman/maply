import { t } from "elysia";
import { UserRole, UserStatus } from "./enums.model";

export const createUserSchema = t.Object({
    fullName: t.String({ minLength: 1 }),
    email: t.String({ format: "email" }),
    password: t.String({ minLength: 6 }),
    phone: t.Optional(t.Nullable(t.String())),
    role: t.Optional(t.Enum(UserRole)),
    status: t.Optional(t.Enum(UserStatus)),
    country: t.Optional(t.Nullable(t.String())),
    address: t.Optional(t.Nullable(t.String()))
});

export const updateUserSchema = t.Partial(createUserSchema);

export type CreateUserBody = typeof createUserSchema.static;
export type UpdateUserBody = typeof updateUserSchema.static;

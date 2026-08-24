import { t } from "elysia";

export const qrTokenParamsSchema = t.Object({
    qrToken: t.String({ minLength: 1 })
});

export const registerQrCardSchema = t.Object({
    fullName: t.String({ minLength: 1 }),
    email: t.String({ format: "email" }),
    password: t.String({ minLength: 6 }),
    phone: t.Optional(t.Nullable(t.String())),
    country: t.Optional(t.Nullable(t.String())),
    address: t.Optional(t.Nullable(t.String()))
});

export type QrTokenParams = typeof qrTokenParamsSchema.static;
export type RegisterQrCardBody = typeof registerQrCardSchema.static;

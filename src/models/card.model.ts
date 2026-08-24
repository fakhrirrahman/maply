import { t } from "elysia";
import { CardStatus } from "./enums.model";

export const createCardSchema = t.Object({
    cardNumber: t.String({ minLength: 1 }),
    qrToken: t.String({ minLength: 1 }),
    agentId: t.Optional(t.Nullable(t.String({ pattern: "^\\d+$" }))),
    ownerId: t.Optional(t.Nullable(t.String({ pattern: "^\\d+$" }))),
    status: t.Optional(t.Enum(CardStatus)),
    registeredAt: t.Optional(t.Nullable(t.String({ format: "date-time" }))),
    activatedAt: t.Optional(t.Nullable(t.String({ format: "date-time" }))),
    expiredAt: t.Optional(t.Nullable(t.String({ format: "date-time" })))
});

export const updateCardSchema = t.Partial(createCardSchema);

export type CreateCardBody = typeof createCardSchema.static;
export type UpdateCardBody = typeof updateCardSchema.static;

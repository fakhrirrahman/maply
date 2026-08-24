import { t } from "elysia";
import { TransactionStatus } from "./enums.model";

export const createTransactionSchema = t.Object({
    transactionNumber: t.String({ minLength: 1 }),
    cardId: t.String({ pattern: "^\\d+$" }),
    userId: t.String({ pattern: "^\\d+$" }),
    priceId: t.String({ pattern: "^\\d+$" }),
    baseAmount: t.String({ examples: ["100000.00"] }),
    taxAmount: t.Optional(t.String({ examples: ["0.00"] })),
    serviceFee: t.Optional(t.String({ examples: ["0.00"] })),
    discountAmount: t.Optional(t.String({ examples: ["0.00"] })),
    totalAmount: t.String({ examples: ["100000.00"] }),
    currency: t.Optional(t.String({ minLength: 3, maxLength: 3 })),
    status: t.Optional(t.Enum(TransactionStatus)),
    expiredAt: t.Optional(t.Nullable(t.String({ format: "date-time" }))),
    paidAt: t.Optional(t.Nullable(t.String({ format: "date-time" })))
});

export const updateTransactionSchema = t.Partial(createTransactionSchema);

export type CreateTransactionBody = typeof createTransactionSchema.static;
export type UpdateTransactionBody = typeof updateTransactionSchema.static;

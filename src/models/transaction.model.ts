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

export const midtransChargeSchema = t.Object({
    paymentMethodId: t.String({ pattern: "^\\d+$" }),
    paymentType: t.Optional(t.Union([
        t.Literal("bank_transfer"),
        t.Literal("echannel"),
        t.Literal("qris")
    ])),
    bank: t.Optional(t.Union([
        t.Literal("bca"),
        t.Literal("bni"),
        t.Literal("bri"),
        t.Literal("permata"),
        t.Literal("cimb"),
        t.Literal("mandiri"),
        t.Literal("qris")
    ])),
    acquirer: t.Optional(t.Union([
        t.Literal("gopay"),
        t.Literal("airpay shopee")
    ])),
    vaNumber: t.Optional(t.String({ pattern: "^\\d+$" }))
});

export type CreateTransactionBody = typeof createTransactionSchema.static;
export type UpdateTransactionBody = typeof updateTransactionSchema.static;
export type MidtransChargeBody = typeof midtransChargeSchema.static;

import { t } from "elysia";
import { PaymentStatus } from "./enums.model";

export const createPaymentSchema = t.Object({
    transactionId: t.String({ pattern: "^\\d+$" }),
    paymentMethodId: t.String({ pattern: "^\\d+$" }),
    paymentProvider: t.Optional(t.Nullable(t.String())),
    providerTransactionId: t.Optional(t.Nullable(t.String())),
    providerReference: t.Optional(t.Nullable(t.String())),
    amount: t.String({ examples: ["100000.00"] }),
    paymentFee: t.Optional(t.String({ examples: ["0.00"] })),
    totalPaid: t.Optional(t.Nullable(t.String({ examples: ["100000.00"] }))),
    status: t.Optional(t.Enum(PaymentStatus)),
    expiredAt: t.Optional(t.Nullable(t.String({ format: "date-time" }))),
    paidAt: t.Optional(t.Nullable(t.String({ format: "date-time" })))
});

export const updatePaymentSchema = t.Partial(createPaymentSchema);

export type CreatePaymentBody = typeof createPaymentSchema.static;
export type UpdatePaymentBody = typeof updatePaymentSchema.static;

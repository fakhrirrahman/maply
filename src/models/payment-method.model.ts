import { t } from "elysia";
import { FeeType, PaymentMethodStatus } from "./enums.model";

export const createPaymentMethodSchema = t.Object({
    methodCode: t.String({ minLength: 1 }),
    methodName: t.String({ minLength: 1 }),
    provider: t.Optional(t.Nullable(t.String())),
    providerCode: t.Optional(t.Nullable(t.String())),
    methodType: t.Optional(t.Nullable(t.String())),
    feeType: t.Optional(t.Nullable(t.Enum(FeeType))),
    feeValue: t.Optional(t.String({ examples: ["0.00"] })),
    minAmount: t.Optional(t.Nullable(t.String({ examples: ["10000.00"] }))),
    maxAmount: t.Optional(t.Nullable(t.String({ examples: ["1000000.00"] }))),
    status: t.Optional(t.Enum(PaymentMethodStatus)),
    sortOrder: t.Optional(t.Number())
});

export const updatePaymentMethodSchema = t.Partial(createPaymentMethodSchema);

export type CreatePaymentMethodBody = typeof createPaymentMethodSchema.static;
export type UpdatePaymentMethodBody = typeof updatePaymentMethodSchema.static;

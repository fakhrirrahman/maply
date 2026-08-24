import { t } from "elysia";
import { PriceStatus, TaxType } from "./enums.model";

export const createPriceSchema = t.Object({
    priceCode: t.String({ minLength: 1 }),
    priceName: t.String({ minLength: 1 }),
    amount: t.String({ examples: ["100000.00"] }),
    currency: t.Optional(t.String({ minLength: 3, maxLength: 3 })),
    taxType: t.Optional(t.Nullable(t.Enum(TaxType))),
    taxValue: t.Optional(t.String({ examples: ["0.00"] })),
    serviceFee: t.Optional(t.String({ examples: ["0.00"] })),
    status: t.Optional(t.Enum(PriceStatus)),
    effectiveFrom: t.Optional(t.Nullable(t.String({ format: "date-time" }))),
    effectiveUntil: t.Optional(t.Nullable(t.String({ format: "date-time" })))
});

export const updatePriceSchema = t.Partial(createPriceSchema);

export type CreatePriceBody = typeof createPriceSchema.static;
export type UpdatePriceBody = typeof updatePriceSchema.static;

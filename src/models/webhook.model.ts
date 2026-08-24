import { t } from "elysia";

export const midtransWebhookSchema = t.Object({
    transaction_status: t.String(),
    transaction_id: t.String(),
    status_code: t.String(),
    signature_key: t.String(),
    order_id: t.String(),
    gross_amount: t.String(),
    transaction_time: t.Optional(t.String()),
    status_message: t.Optional(t.String()),
    payment_type: t.Optional(t.String()),
    merchant_id: t.Optional(t.String()),
    fraud_status: t.Optional(t.String())
});

export type MidtransWebhookBody = typeof midtransWebhookSchema.static;

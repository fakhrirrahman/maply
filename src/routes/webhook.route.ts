import { Elysia } from "elysia";
import { webhookController } from "../controllers/webhook.controller";
import { errorResponseSchema, successResponseSchema } from "../models/common.model";
import { midtransWebhookSchema } from "../models/webhook.model";

export const webhookRoutes = new Elysia({ prefix: "/webhooks" })
    .post("/midtrans", webhookController.midtrans, {
        body: midtransWebhookSchema,
        response: { 200: successResponseSchema, 401: errorResponseSchema, 404: errorResponseSchema, 422: errorResponseSchema },
        detail: {
            tags: ["Webhooks"],
            summary: "Handle Midtrans notification webhook",
            security: []
        }
    });

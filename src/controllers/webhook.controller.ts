import type { MidtransWebhookBody } from "../models/webhook.model";
import { webhookService } from "../services/webhook.service";
import { Response } from "../utils/response";

export const webhookController = {
    async midtrans({ body }: { body: MidtransWebhookBody }) {
        return Response.success(await webhookService.handleMidtrans(body), "Webhook processed successfully");
    }
};

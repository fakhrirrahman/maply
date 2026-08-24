import type { QrTokenParams, RegisterQrCardBody } from "../models/public.model";
import { publicService } from "../services/public.service";
import { Response } from "../utils/response";

export const publicController = {
    async lookupCard({ params }: { params: QrTokenParams }) {
        return Response.success(await publicService.lookupCard(params.qrToken));
    },

    async registerCard({ params, body }: { params: QrTokenParams; body: RegisterQrCardBody }) {
        return Response.created(
            await publicService.registerCard(params.qrToken, body),
            "Card registered successfully"
        );
    },

    async getPublicMap({ params }: { params: QrTokenParams }) {
        return Response.success(await publicService.getPublicMap(params.qrToken));
    }
};

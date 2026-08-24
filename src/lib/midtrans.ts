import { AppError, HTTP_STATUS } from "../errors";

const sandboxBaseUrl = "https://api.sandbox.midtrans.com";
const productionBaseUrl = "https://api.midtrans.com";

export type MidtransBankTransferBank = "bca" | "bni" | "bri" | "permata" | "cimb";

export type MidtransChargeRequest = {
    payment_type: "bank_transfer" | "echannel" | "qris";
    transaction_details: {
        order_id: string;
        gross_amount: number;
    };
    bank_transfer?: {
        bank: MidtransBankTransferBank;
        va_number?: string;
    };
    echannel?: {
        bill_info1: string;
        bill_info2: string;
        bill_key?: string;
    };
    qris?: {
        acquirer?: "gopay" | "airpay shopee";
    };
    customer_details?: {
        first_name?: string;
        email?: string;
        phone?: string;
    };
};

export type MidtransChargeResponse = {
    status_code: string;
    status_message: string;
    transaction_id?: string;
    order_id?: string;
    gross_amount?: string;
    payment_type?: string;
    transaction_time?: string;
    transaction_status?: string;
    fraud_status?: string;
    va_numbers?: Array<{
        bank: string;
        va_number: string;
    }>;
    permata_va_number?: string;
    bill_key?: string;
    biller_code?: string;
    qr_string?: string;
    acquirer?: string;
    actions?: Array<{
        name: string;
        method: string;
        url: string;
    }>;
};

export type MidtransNotificationPayload = {
    transaction_time?: string;
    transaction_status: string;
    transaction_id: string;
    status_message?: string;
    status_code: string;
    signature_key: string;
    payment_type?: string;
    order_id: string;
    merchant_id?: string;
    gross_amount: string;
    fraud_status?: string;
};

function getMidtransBaseUrl() {
    return process.env.MIDTRANS_IS_PRODUCTION === "true"
        ? productionBaseUrl
        : sandboxBaseUrl;
}

function getAuthorizationHeader() {
    return `Basic ${Buffer.from(`${getMidtransServerKey()}:`).toString("base64")}`;
}

export function getMidtransServerKey() {
    const serverKey = process.env.MIDTRANS_SERVER_KEY;

    if (!serverKey) {
        throw new AppError("MIDTRANS_SERVER_KEY is required", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    return serverKey;
}

export const midtransClient = {
    async charge(payload: MidtransChargeRequest) {
        const response = await fetch(`${getMidtransBaseUrl()}/v2/charge`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: getAuthorizationHeader()
            },
            body: JSON.stringify(payload)
        });

        const body = await response.json() as MidtransChargeResponse;

        if (!response.ok) {
            throw new AppError(
                body.status_message || "Midtrans charge failed",
                HTTP_STATUS.BAD_REQUEST,
                body
            );
        }

        return body;
    }
};

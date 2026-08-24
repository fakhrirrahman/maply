import { createHash } from "node:crypto";
import { AppError, HTTP_STATUS } from "../errors";
import { getMidtransServerKey } from "../lib/midtrans";
import { CardStatus, PaymentStatus, TransactionStatus } from "../models/enums.model";
import type { MidtransWebhookBody } from "../models/webhook.model";
import { cardRepository } from "../repositories/card.repository";
import { paymentRepository } from "../repositories/payment.repository";
import { transactionRepository } from "../repositories/transaction.repository";
import { serializePrisma } from "../utils/serializer";

function buildSignature(body: MidtransWebhookBody) {
    return createHash("sha512")
        .update(`${body.order_id}${body.status_code}${body.gross_amount}${getMidtransServerKey()}`)
        .digest("hex");
}

function mapPaymentStatus(status: string) {
    switch (status) {
        case "capture":
        case "settlement":
            return PaymentStatus.PAID;
        case "pending":
            return PaymentStatus.PENDING;
        case "deny":
        case "failure":
            return PaymentStatus.FAILED;
        case "expire":
            return PaymentStatus.EXPIRED;
        case "cancel":
            return PaymentStatus.CANCELLED;
        case "refund":
        case "partial_refund":
            return PaymentStatus.REFUNDED;
        default:
            return PaymentStatus.PENDING;
    }
}

function mapTransactionStatus(status: PaymentStatus) {
    switch (status) {
        case PaymentStatus.PAID:
            return TransactionStatus.PAID;
        case PaymentStatus.FAILED:
            return TransactionStatus.FAILED;
        case PaymentStatus.EXPIRED:
            return TransactionStatus.EXPIRED;
        case PaymentStatus.CANCELLED:
            return TransactionStatus.CANCELLED;
        case PaymentStatus.REFUNDED:
            return TransactionStatus.REFUNDED;
        default:
            return TransactionStatus.PENDING;
    }
}

export const webhookService = {
    async handleMidtrans(body: MidtransWebhookBody) {
        const expectedSignature = buildSignature(body);

        if (body.signature_key !== expectedSignature) {
            throw new AppError("Invalid Midtrans signature", HTTP_STATUS.UNAUTHORIZED);
        }

        const transaction = await transactionRepository.findByTransactionNumber(body.order_id);

        if (!transaction) {
            throw new AppError("Transaction not found", HTTP_STATUS.NOT_FOUND);
        }

        const paymentStatus = mapPaymentStatus(body.transaction_status);
        const transactionStatus = mapTransactionStatus(paymentStatus);
        const paidAt = paymentStatus === PaymentStatus.PAID ? new Date() : undefined;

        const existingPayment = await paymentRepository.findByProviderTransactionId(body.transaction_id);

        if (!existingPayment) {
            throw new AppError("Payment not found", HTTP_STATUS.NOT_FOUND);
        }

        const payment = await paymentRepository.update(existingPayment.id, {
            status: paymentStatus,
            totalPaid: paymentStatus === PaymentStatus.PAID ? body.gross_amount : existingPayment.totalPaid,
            paidAt
        });

        const updatedTransaction = await transactionRepository.update(transaction.id, {
            status: transactionStatus,
            paidAt
        });

        const activatedCard = paymentStatus === PaymentStatus.PAID
            ? await cardRepository.update(transaction.cardId, {
                status: CardStatus.ACTIVE,
                activatedAt: new Date()
            })
            : null;

        return serializePrisma({
            payment,
            transaction: updatedTransaction,
            card: activatedCard
        });
    }
};

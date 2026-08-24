import { AppError, HTTP_STATUS } from "../errors";
import { midtransClient, type MidtransBankTransferBank } from "../lib/midtrans";
import { PaymentStatus } from "../models/enums.model";
import type { CreateTransactionBody, MidtransChargeBody, UpdateTransactionBody } from "../models/transaction.model";
import { paymentMethodRepository } from "../repositories/payment-method.repository";
import { paymentRepository } from "../repositories/payment.repository";
import { transactionRepository } from "../repositories/transaction.repository";
import { parseId, parsePagination, type PaginationQuery } from "../utils/request";
import { serializePrisma } from "../utils/serializer";

function nullableDate(value?: string | null) {
    return value === null || value === undefined ? value : new Date(value);
}

function mapTransactionBody(body: CreateTransactionBody | UpdateTransactionBody) {
    return {
        ...body,
        cardId: body.cardId ? parseId(body.cardId, "cardId") : undefined,
        userId: body.userId ? parseId(body.userId, "userId") : undefined,
        priceId: body.priceId ? parseId(body.priceId, "priceId") : undefined,
        expiredAt: nullableDate(body.expiredAt),
        paidAt: nullableDate(body.paidAt)
    };
}

function toGrossAmount(value: { toString: () => string }) {
    return Number(value.toString());
}

function mapMidtransStatus(status?: string) {
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

function getProviderReference(response: Awaited<ReturnType<typeof midtransClient.charge>>) {
    return response.va_numbers?.[0]?.va_number
        ?? response.permata_va_number
        ?? response.bill_key
        ?? response.actions?.find((action) => action.name === "generate-qr-code-v2")?.url
        ?? response.actions?.find((action) => action.name === "generate-qr-code")?.url
        ?? response.qr_string
        ?? response.order_id
        ?? null;
}

function resolveMidtransPayment(body: MidtransChargeBody, paymentMethod: Awaited<ReturnType<typeof paymentMethodRepository.findById>>) {
    const selectedPaymentType = body.paymentType
        ?? paymentMethod?.methodType?.toLowerCase()
        ?? paymentMethod?.methodCode.toLowerCase();

    if (selectedPaymentType === "qris" || body.bank === "qris") {
        const acquirer = body.acquirer
            ?? (paymentMethod?.providerCode?.toLowerCase() as "gopay" | "airpay shopee" | undefined)
            ?? "gopay";

        return {
            payment_type: "qris" as const,
            qris: {
                acquirer
            }
        };
    }

    const selectedBank = body.bank
        ?? paymentMethod?.providerCode?.toLowerCase()
        ?? paymentMethod?.methodCode.toLowerCase();

    if (selectedBank === "mandiri") {
        return {
            payment_type: "echannel" as const,
            echannel: {
                bill_info1: "Payment:",
                bill_info2: "Maply",
                bill_key: body.vaNumber
            }
        };
    }

    const allowedBanks: MidtransBankTransferBank[] = ["bca", "bni", "bri", "permata", "cimb"];

    if (!allowedBanks.includes(selectedBank as MidtransBankTransferBank)) {
        throw new AppError("Unsupported Midtrans bank transfer method", HTTP_STATUS.BAD_REQUEST);
    }

    return {
        payment_type: "bank_transfer" as const,
        bank_transfer: {
            bank: selectedBank as MidtransBankTransferBank,
            va_number: body.vaNumber
        }
    };
}

export const transactionService = {
    async list(query: PaginationQuery) {
        const { page, limit, skip } = parsePagination(query);
        const [items, total] = await Promise.all([
            transactionRepository.findMany(skip, limit),
            transactionRepository.count()
        ]);
        return { data: serializePrisma(items), page, limit, total };
    },

    async detail(id: string) {
        const item = await transactionRepository.findById(parseId(id));
        if (!item) throw new AppError("Transaction not found", HTTP_STATUS.NOT_FOUND);
        return serializePrisma(item);
    },

    async create(body: CreateTransactionBody) {
        return serializePrisma(await transactionRepository.create({
            transactionNumber: body.transactionNumber,
            cardId: parseId(body.cardId, "cardId"),
            userId: parseId(body.userId, "userId"),
            priceId: parseId(body.priceId, "priceId"),
            baseAmount: body.baseAmount,
            taxAmount: body.taxAmount,
            serviceFee: body.serviceFee,
            discountAmount: body.discountAmount,
            totalAmount: body.totalAmount,
            currency: body.currency,
            status: body.status,
            expiredAt: nullableDate(body.expiredAt),
            paidAt: nullableDate(body.paidAt)
        }));
    },

    async update(id: string, body: UpdateTransactionBody) {
        await this.detail(id);
        return serializePrisma(await transactionRepository.update(parseId(id), mapTransactionBody(body)));
    },

    async delete(id: string) {
        await this.detail(id);
        return serializePrisma(await transactionRepository.delete(parseId(id)));
    },

    async chargeWithMidtrans(id: string, body: MidtransChargeBody) {
        const transactionId = parseId(id);
        const transaction = await transactionRepository.findById(transactionId);

        if (!transaction) {
            throw new AppError("Transaction not found", HTTP_STATUS.NOT_FOUND);
        }

        const paymentMethodId = parseId(body.paymentMethodId, "paymentMethodId");
        const paymentMethod = await paymentMethodRepository.findById(paymentMethodId);

        if (!paymentMethod) {
            throw new AppError("Payment method not found", HTTP_STATUS.NOT_FOUND);
        }

        const paymentConfig = resolveMidtransPayment(body, paymentMethod);
        const midtransResponse = await midtransClient.charge({
            ...paymentConfig,
            transaction_details: {
                order_id: transaction.transactionNumber,
                gross_amount: toGrossAmount(transaction.totalAmount)
            },
            customer_details: {
                first_name: transaction.user.fullName,
                email: transaction.user.email,
                phone: transaction.user.phone ?? undefined
            }
        });

        const payment = await paymentRepository.create({
            transactionId,
            paymentMethodId,
            paymentProvider: "midtrans",
            providerTransactionId: midtransResponse.transaction_id,
            providerReference: getProviderReference(midtransResponse),
            amount: transaction.totalAmount,
            paymentFee: 0,
            totalPaid: null,
            status: mapMidtransStatus(midtransResponse.transaction_status)
        });

        return serializePrisma({
            payment,
            midtrans: midtransResponse
        });
    }
};

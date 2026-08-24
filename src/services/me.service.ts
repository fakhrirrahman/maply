import { AppError, HTTP_STATUS } from "../errors";
import type { AuthUser } from "../middleware/jwt.middleware";
import { CardStatus, PaymentMethodStatus, PriceStatus } from "../models/enums.model";
import type { MidtransChargeBody } from "../models/transaction.model";
import type { CreateUserMapBody, UpdateUserMapBody } from "../models/user-map.model";
import { cardRepository } from "../repositories/card.repository";
import { paymentMethodRepository } from "../repositories/payment-method.repository";
import { priceRepository } from "../repositories/price.repository";
import { transactionRepository } from "../repositories/transaction.repository";
import { transactionService } from "./transaction.service";
import { userMapRepository } from "../repositories/user-map.repository";
import { parseId, parsePagination, type PaginationQuery } from "../utils/request";
import { serializePrisma } from "../utils/serializer";

function mapUserMapBody(body: Omit<CreateUserMapBody, "userId"> | UpdateUserMapBody) {
    return {
        mapName: body.mapName,
        description: body.description,
        status: body.status
    };
}

type CheckoutCardBody = MidtransChargeBody & {
    priceId: string;
};

function toAmount(value: { toString: () => string } | null | undefined) {
    return Number(value?.toString() ?? "0");
}

function money(value: number) {
    return value.toFixed(2);
}

function createTransactionNumber(cardId: string) {
    const timestamp = new Date()
        .toISOString()
        .replace(/\D/g, "")
        .slice(0, 14);
    const random = crypto.randomUUID().slice(0, 8).toUpperCase();

    return `INV-${timestamp}-${cardId}-${random}`;
}

export const meService = {
    async ensureHasActiveCard(user: AuthUser) {
        const activeCardCount = await cardRepository.countActiveByOwner(parseId(user.sub, "userId"));

        if (activeCardCount < 1) {
            throw new AppError("Please complete payment before accessing dashboard", HTTP_STATUS.FORBIDDEN);
        }
    },

    async listCards(user: AuthUser, query: PaginationQuery) {
        const userId = parseId(user.sub, "userId");
        const { page, limit, skip } = parsePagination(query);
        const [items, total] = await Promise.all([
            cardRepository.findManyByOwner(userId, skip, limit),
            cardRepository.countByOwner(userId)
        ]);

        return { data: serializePrisma(items), page, limit, total };
    },

    async checkoutCard(user: AuthUser, cardId: string, body: CheckoutCardBody) {
        const userId = parseId(user.sub, "userId");
        const parsedCardId = parseId(cardId, "cardId");
        const card = await cardRepository.findByIdAndOwner(parsedCardId, userId);

        if (!card) {
            throw new AppError("Card not found", HTTP_STATUS.NOT_FOUND);
        }

        if (card.status !== CardStatus.REGISTERED && card.status !== CardStatus.PAYMENT_PENDING) {
            throw new AppError("Card is not ready for checkout", HTTP_STATUS.BAD_REQUEST);
        }

        const price = await priceRepository.findById(parseId(body.priceId, "priceId"));

        if (!price || price.status !== PriceStatus.ACTIVE) {
            throw new AppError("Active price not found", HTTP_STATUS.NOT_FOUND);
        }

        const paymentMethod = await paymentMethodRepository.findById(parseId(body.paymentMethodId, "paymentMethodId"));

        if (!paymentMethod || paymentMethod.status !== PaymentMethodStatus.ACTIVE) {
            throw new AppError("Active payment method not found", HTTP_STATUS.NOT_FOUND);
        }

        const baseAmount = toAmount(price.amount);
        const taxAmount = toAmount(price.taxValue);
        const serviceFee = toAmount(price.serviceFee);
        const totalAmount = baseAmount + taxAmount + serviceFee;

        const transaction = await transactionRepository.create({
            transactionNumber: createTransactionNumber(cardId),
            cardId: parsedCardId,
            userId,
            priceId: price.id,
            baseAmount: money(baseAmount),
            taxAmount: money(taxAmount),
            serviceFee: money(serviceFee),
            discountAmount: "0.00",
            totalAmount: money(totalAmount),
            currency: price.currency,
            status: "PENDING"
        });

        await cardRepository.update(parsedCardId, {
            status: CardStatus.PAYMENT_PENDING
        });

        const charge = await transactionService.chargeWithMidtrans(transaction.id.toString(), {
            paymentMethodId: body.paymentMethodId,
            paymentType: body.paymentType,
            bank: body.bank,
            acquirer: body.acquirer,
            vaNumber: body.vaNumber
        });

        return serializePrisma({
            transaction,
            charge
        });
    },

    async listMaps(user: AuthUser, query: PaginationQuery) {
        await this.ensureHasActiveCard(user);

        const userId = parseId(user.sub, "userId");
        const { page, limit, skip } = parsePagination(query);
        const [items, total] = await Promise.all([
            userMapRepository.findManyByUser(userId, skip, limit),
            userMapRepository.countByUser(userId)
        ]);

        return { data: serializePrisma(items), page, limit, total };
    },

    async detailMap(user: AuthUser, id: string) {
        await this.ensureHasActiveCard(user);

        const map = await userMapRepository.findByIdAndUser(parseId(id), parseId(user.sub, "userId"));

        if (!map) {
            throw new AppError("User map not found", HTTP_STATUS.NOT_FOUND);
        }

        return serializePrisma(map);
    },

    async createMap(user: AuthUser, body: Omit<CreateUserMapBody, "userId">) {
        await this.ensureHasActiveCard(user);

        return serializePrisma(await userMapRepository.create({
            ...mapUserMapBody(body),
            userId: parseId(user.sub, "userId")
        }));
    },

    async updateMap(user: AuthUser, id: string, body: UpdateUserMapBody) {
        await this.ensureHasActiveCard(user);
        await this.detailMap(user, id);
        return serializePrisma(await userMapRepository.update(parseId(id), mapUserMapBody(body)));
    },

    async deleteMap(user: AuthUser, id: string) {
        await this.ensureHasActiveCard(user);
        await this.detailMap(user, id);
        return serializePrisma(await userMapRepository.delete(parseId(id)));
    }
};

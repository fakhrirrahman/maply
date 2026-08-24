import { AppError, HTTP_STATUS } from "../errors";
import { CardStatus, UserRole, UserStatus } from "../models/enums.model";
import type { RegisterQrCardBody } from "../models/public.model";
import { cardRepository } from "../repositories/card.repository";
import { userMapRepository } from "../repositories/user-map.repository";
import { userRepository } from "../repositories/user.repository";
import { serializePrisma } from "../utils/serializer";

export const publicService = {
    async lookupCard(qrToken: string) {
        const card = await cardRepository.findByQrToken(qrToken);

        if (!card) {
            throw new AppError("Card not found", HTTP_STATUS.NOT_FOUND);
        }

        return serializePrisma({
            id: card.id,
            cardNumber: card.cardNumber,
            qrToken: card.qrToken,
            status: card.status,
            registeredAt: card.registeredAt,
            activatedAt: card.activatedAt,
            expiredAt: card.expiredAt
        });
    },

    async registerCard(qrToken: string, body: RegisterQrCardBody) {
        const card = await cardRepository.findByQrToken(qrToken);

        if (!card) {
            throw new AppError("Card not found", HTTP_STATUS.NOT_FOUND);
        }

        if (card.status !== CardStatus.AVAILABLE && card.status !== CardStatus.ASSIGNED) {
            throw new AppError("Card is not available for registration", HTTP_STATUS.BAD_REQUEST);
        }

        const user = await userRepository.create({
            fullName: body.fullName,
            email: body.email,
            passwordHash: await Bun.password.hash(body.password),
            phone: body.phone,
            country: body.country,
            address: body.address,
            role: UserRole.USER,
            status: UserStatus.ACTIVE,
            registeredAt: new Date()
        });

        const updatedCard = await cardRepository.update(card.id, {
            ownerId: user.id,
            status: CardStatus.REGISTERED,
            registeredAt: new Date()
        });

        return serializePrisma({
            user,
            card: updatedCard
        });
    },

    async getPublicMap(qrToken: string) {
        const card = await cardRepository.findByQrToken(qrToken);

        if (!card) {
            throw new AppError("Card not found", HTTP_STATUS.NOT_FOUND);
        }

        if (card.status !== CardStatus.ACTIVE || !card.ownerId) {
            throw new AppError("Card is not active", HTTP_STATUS.FORBIDDEN);
        }

        const map = await userMapRepository.findActiveByUser(card.ownerId);

        if (!map) {
            throw new AppError("Map not found", HTTP_STATUS.NOT_FOUND);
        }

        return serializePrisma({
            card: {
                id: card.id,
                cardNumber: card.cardNumber,
                status: card.status
            },
            owner: card.owner,
            map
        });
    }
};

import { UserStatus } from "../models/enums.model";
import { AppError, HTTP_STATUS } from "../errors";
import type { CreateUserBody, UpdateUserBody } from "../models/user.model";
import { userRepository } from "../repositories/user.repository";
import { parseId, parsePagination, type PaginationQuery } from "../utils/request";
import { serializePrisma } from "../utils/serializer";

export const userService = {
    async list(query: PaginationQuery) {
        const { page, limit, skip } = parsePagination(query);
        const [items, total] = await Promise.all([
            userRepository.findMany(skip, limit),
            userRepository.count()
        ]);

        return { data: serializePrisma(items), page, limit, total };
    },

    async detail(id: string) {
        const user = await userRepository.findById(parseId(id));

        if (!user) {
            throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
        }

        return serializePrisma(user);
    },

    async create(body: CreateUserBody) {
        const passwordHash = await Bun.password.hash(body.password);
        const user = await userRepository.create({
            fullName: body.fullName,
            email: body.email,
            passwordHash,
            phone: body.phone,
            role: body.role,
            status: body.status ?? UserStatus.ACTIVE,
            country: body.country,
            address: body.address,
            registeredAt: new Date()
        });

        return serializePrisma(user);
    },

    async update(id: string, body: UpdateUserBody) {
        await this.detail(id);

        const { password, ...userData } = body;
        const user = await userRepository.update(parseId(id), {
            ...userData,
            ...(password ? { passwordHash: await Bun.password.hash(password) } : {})
        });

        return serializePrisma(user);
    },

    async delete(id: string) {
        await this.detail(id);
        return serializePrisma(await userRepository.delete(parseId(id)));
    }
};

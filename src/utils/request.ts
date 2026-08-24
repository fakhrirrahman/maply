import { AppError, HTTP_STATUS } from "../errors";

export type PaginationQuery = {
    page?: string;
    limit?: string;
};

export function parseId(id: string, field: string = "id") {
    if (!/^\d+$/.test(id)) {
        throw new AppError(`Invalid ${field}`, HTTP_STATUS.BAD_REQUEST);
    }

    return BigInt(id);
}

export function parsePagination(query: PaginationQuery) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);

    if (!Number.isInteger(page) || page < 1) {
        throw new AppError("Invalid page", HTTP_STATUS.BAD_REQUEST);
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        throw new AppError("Invalid limit", HTTP_STATUS.BAD_REQUEST);
    }

    return {
        page,
        limit,
        skip: (page - 1) * limit
    };
}

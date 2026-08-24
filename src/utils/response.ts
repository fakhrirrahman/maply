export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
}

export const Response = {

    success<T>(
        data: T,
        message: string = "Success"
    ) {
        return {
            success: true,
            message,
            data
        };
    },

    created<T>(
        data: T,
        message: string = "Created successfully"
    ) {
        return {
            success: true,
            message,
            data
        };
    },

    error(
        message: string = "Something went wrong",
        errors: unknown = null
    ) {
        return {
            success: false,
            message,
            errors
        };
    },

    validation(
        errors: unknown,
        message: string = "Validation failed"
    ) {
        return {
            success: false,
            message,
            errors
        };
    },

    paginated<T>(
        data: T[],
        page: number,
        limit: number,
        total: number,
        message: string = "Success"
    ) {
        return {
            success: true,
            message,
            data,
            pagination: {
                page,
                limit,
                total,
                total_pages: Math.ceil(total / limit)
            }
        };
    }

};
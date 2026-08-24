import { AppError } from "./app.error";
import { HTTP_STATUS } from "./http-status";

type ErrorResponseOptions = {
    message: string;
    code?: string;
    details?: unknown;
};

export function createErrorResponse({
    message,
    code,
    details
}: ErrorResponseOptions) {
    return {
        success: false,
        message,
        code,
        details
    };
}

export function normalizeError(error: unknown) {
    if (error instanceof AppError) {
        return {
            statusCode: error.statusCode,
            response: createErrorResponse({
                message: error.message,
                code: error.name,
                details: error.details
            })
        };
    }

    return {
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        response: createErrorResponse({
            message: "Internal server error",
            code: "INTERNAL_SERVER_ERROR"
        })
    };
}

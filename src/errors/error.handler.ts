import { Elysia } from "elysia";
import { HTTP_STATUS } from "./http-status";
import { normalizeError } from "./error-response";
import { logger } from "../lib/logger";
import { Response } from "../utils/response";

function formatValidationError(error: unknown) {
    if (typeof error !== "object" || error === null) {
        return error;
    }

    const validationError = error as {
        type?: string;
        message?: string;
        valueError?: {
            path?: string;
            message?: string;
            value?: unknown;
        };
    };

    return {
        type: validationError.type,
        message: validationError.valueError?.message ?? validationError.message,
        path: validationError.valueError?.path,
        value: validationError.valueError?.value
    };
}

export const errorHandler = new Elysia({
    name: "error.handler"
}).onError(({ code, error, request, status }) => {
    logger.error({
        code,
        error,
        method: request.method,
        path: new URL(request.url).pathname
    }, "request failed");

    if (code === "NOT_FOUND") {
        return status(
            HTTP_STATUS.NOT_FOUND,
            Response.error("Route not found")
        );
    }

    if (code === "VALIDATION") {
        return status(
            HTTP_STATUS.UNPROCESSABLE_ENTITY,
            Response.validation(formatValidationError(error))
        );
    }

    const normalizedError = normalizeError(error);

    return status(normalizedError.statusCode, normalizedError.response);
}).as("global");

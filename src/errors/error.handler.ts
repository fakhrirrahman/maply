import { Elysia } from "elysia";
import { HTTP_STATUS } from "./http-status";
import { normalizeError, createErrorResponse } from "./error-response";

export const errorHandler = new Elysia({
    name: "error.handler"
}).onError(({ code, error, status }) => {
    if (code === "NOT_FOUND") {
        return status(
            HTTP_STATUS.NOT_FOUND,
            createErrorResponse({
                message: "Route not found",
                code: "NOT_FOUND"
            })
        );
    }

    if (code === "VALIDATION") {
        return status(
            HTTP_STATUS.UNPROCESSABLE_ENTITY,
            createErrorResponse({
                message: "Validation error",
                code: "VALIDATION_ERROR",
                details: error
            })
        );
    }

    const normalizedError = normalizeError(error);

    return status(normalizedError.statusCode, normalizedError.response);
});

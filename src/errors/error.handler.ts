import { Elysia } from "elysia";
import { HTTP_STATUS } from "./http-status";
import { normalizeError } from "./error-response";
import { Response } from "../utils/response";

export const errorHandler = new Elysia({
    name: "error.handler"
}).onError(({ code, error, status }) => {
    if (code === "NOT_FOUND") {
        return status(
            HTTP_STATUS.NOT_FOUND,
            Response.error("Route not found")
        );
    }

    if (code === "VALIDATION") {
        return status(
            HTTP_STATUS.UNPROCESSABLE_ENTITY,
            Response.validation(error)
        );
    }

    const normalizedError = normalizeError(error);

    return status(normalizedError.statusCode, normalizedError.response);
});

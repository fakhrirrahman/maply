import { AppError } from "./app.error";
import { HTTP_STATUS } from "./http-status";
import { Response } from "../utils/response";

export function normalizeError(error: unknown) {
    if (error instanceof AppError) {
        return {
            statusCode: error.statusCode,
            response: Response.error(error.message, error.details ?? null)
        };
    }

    return {
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        response: Response.error("Internal server error")
    };
}

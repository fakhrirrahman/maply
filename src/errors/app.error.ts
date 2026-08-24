import { HTTP_STATUS, type HttpStatusCode } from "./http-status";

export class AppError extends Error {
    public readonly statusCode: HttpStatusCode;
    public readonly details?: unknown;

    constructor(
        message: string,
        statusCode: HttpStatusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
        details?: unknown
    ) {
        super(message);

        this.name = "AppError";
        this.statusCode = statusCode;
        this.details = details;
    }
}

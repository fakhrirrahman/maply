import { Elysia } from "elysia";
import { logger } from "../lib/logger";

export const loggerMiddleware = new Elysia({
    name: "logger.middleware"
})
    .derive(() => {
        return {
            requestStartTime: performance.now()
        };
    })
    .onAfterHandle(({ request, set, requestStartTime }) => {
        logger.info({
            method: request.method,
            path: new URL(request.url).pathname,
            statusCode: set.status ?? 200,
            durationMs: Math.round(performance.now() - requestStartTime)
        }, "request completed");
    })
    .as("global");

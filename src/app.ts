import { Elysia } from "elysia";
import { corsConfig } from "./config/cors";
import { swaggerConfig } from "./config/swagger";
import { errorHandler } from "./errors";
import { authRoutes } from "./routes/auth.route";

export const app = new Elysia({
    prefix: "/api"
})
    .use(corsConfig)
    .use(swaggerConfig)
    .use(errorHandler)
    .get("/health", () => ({
        success: true,
        message: "Maply API is running"
    }))
    .use(authRoutes);


export type App = typeof app;

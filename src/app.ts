import { Elysia } from "elysia";
import { errorHandler } from "./errors";
import { authRoutes } from "./routes/auth.route";

export const app = new Elysia({
    prefix: "/api"
})
    .use(errorHandler)
    .get("/health", () => ({
        success: true,
        message: "Maply API is running"
    }))
    .use(authRoutes);


export type App = typeof app;

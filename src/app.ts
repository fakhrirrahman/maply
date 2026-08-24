import { Elysia } from "elysia";
import { db } from "./config/database";

export const app = new Elysia({
    prefix: "/api"
})
.get("/health", () => ({
    success: true,
    message: "Maply API is running"
}))
.get("/db-test", async () => {
    const result = await db`
        SELECT NOW() AS now
    `;

    return {
        success: true,
        data: result
    };
});

export type App = typeof app;
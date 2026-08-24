import { Elysia } from "elysia";

export const app = new Elysia({
    prefix: "/api"
})
.get("/health", () => ({
    success: true,
    message: "Maply API is running"
}))


export type App = typeof app;
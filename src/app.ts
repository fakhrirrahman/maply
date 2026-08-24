import { Elysia } from "elysia";
import { corsConfig } from "./config/cors";
import { swaggerConfig } from "./config/swagger";
import { errorHandler } from "./errors";
import { agentProfileRoutes } from "./routes/agent-profile.route";
import { authRoutes } from "./routes/auth.route";
import { cardAssignmentRoutes } from "./routes/card-assignment.route";
import { cardRoutes } from "./routes/card.route";
import { paymentMethodRoutes } from "./routes/payment-method.route";
import { paymentRoutes } from "./routes/payment.route";
import { priceRoutes } from "./routes/price.route";
import { transactionRoutes } from "./routes/transaction.route";
import { userMapLocationRoutes } from "./routes/user-map-location.route";
import { userMapRoutes } from "./routes/user-map.route";
import { userRoutes } from "./routes/user.route";

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
    .use(authRoutes)
    .use(userRoutes)
    .use(agentProfileRoutes)
    .use(cardRoutes)
    .use(cardAssignmentRoutes)
    .use(userMapRoutes)
    .use(userMapLocationRoutes)
    .use(priceRoutes)
    .use(paymentMethodRoutes)
    .use(transactionRoutes)
    .use(paymentRoutes);


export type App = typeof app;

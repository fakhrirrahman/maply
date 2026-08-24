import { swagger } from "@elysiajs/swagger";

export const swaggerConfig = swagger({
    path: "/docs",

    documentation: {
        info: {
            title: "Maply API",
            version: "1.0.0",
            description: "API documentation for Maply"
        },

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    }
});

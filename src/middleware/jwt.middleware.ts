import { Elysia } from "elysia";
import { jwtPlugin } from "../lib/jwt";
import { Response } from "../utils/response";

export const jwtMiddleware = new Elysia({
    name: "jwt.middleware"
})
.use(jwtPlugin)
.macro({
    auth: {
        async resolve({ jwt, headers, status }) {
            const authorization = headers.authorization;

            if (!authorization?.startsWith("Bearer ")) {
                return status(401, {
                    ...Response.error("Unauthorized")
                });
            }

            const token = authorization.slice(7);

            const payload = await jwt.verify(token);

            if (!payload) {
                return status(401, {
                    ...Response.error("Invalid or expired token")
                });
            }

            return {
                user: payload
            };
        }
    }
});

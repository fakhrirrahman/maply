import { jwt } from "@elysia/jwt";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
    throw new Error("JWT_SECRET is required");
}

export const jwtPlugin = jwt({
    name: "jwt",
    secret: jwtSecret
});

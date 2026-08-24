import { Elysia } from "elysia";
import { jwtPlugin } from "../lib/jwt";
import { UserRole, type UserRole as UserRoleType } from "../models/enums.model";
import { Response } from "../utils/response";

export type AuthUser = {
    sub: string;
    role: UserRoleType;
};

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

            const role = payload.role;

            if (
                typeof payload.sub !== "string"
                || typeof role !== "string"
                || !Object.values(UserRole).includes(role as UserRoleType)
            ) {
                return status(401, {
                    ...Response.error("Invalid token payload")
                });
            }

            return {
                user: {
                    sub: payload.sub,
                    role: role as UserRoleType
                }
            };
        }
    },
    roles(allowedRoles: UserRoleType[]) {
        return {
            beforeHandle({ user, status }: { user?: AuthUser; status: (code: number, body: unknown) => unknown }) {
                if (!user) {
                    return status(401, Response.error("Unauthorized"));
                }

                if (!allowedRoles.includes(user.role)) {
                    return status(403, Response.error("Forbidden"));
                }
            }
        };
    }
});

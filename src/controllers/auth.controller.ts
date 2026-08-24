import { AppError, HTTP_STATUS } from "../errors";
import { authService } from "../services/auth.service";

type LoginBody = {
    userId: string;
    email?: string;
    name?: string;
};

type JwtContext = {
    jwt: {
        sign: (payload: any) => Promise<string>;
        verify: (token: string) => Promise<false | any>;
    };
};

export const authController = {
    async login({ jwt, body }: JwtContext & { body: LoginBody }) {
        const token = await jwt.sign(authService.createTokenPayload(body));

        return {
            success: true,
            token
        };
    },

    async me({
        jwt,
        headers
    }: JwtContext & { headers: { authorization?: string } }) {
        const authorization = headers.authorization;
        const token = authorization?.startsWith("Bearer ")
            ? authorization.slice("Bearer ".length)
            : undefined;

        if (!token) {
            throw new AppError("Missing bearer token", HTTP_STATUS.UNAUTHORIZED);
        }

        const payload = await jwt.verify(token);

        if (!payload) {
            throw new AppError("Invalid token", HTTP_STATUS.UNAUTHORIZED);
        }

        return {
            success: true,
            data: payload
        };
    }
};

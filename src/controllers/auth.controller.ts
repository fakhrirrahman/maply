import type { LoginBody } from "../models/auth.model";
import type { AuthTokenPayload } from "../services/auth.service";
import { authService } from "../services/auth.service";
import { Response } from "../utils/response";

type JwtContext = {
    jwt: {
        sign: (payload: AuthTokenPayload) => Promise<string>;
    };
};

export const authController = {
    async login({ jwt, body }: JwtContext & { body: LoginBody }) {
        const data = await authService.login(body, jwt);

        return Response.success(data, "Login successful");
    }
};

import { UserStatus, type UserRole } from "../../generated/prisma/enums";
import { AppError, HTTP_STATUS } from "../errors";
import { authRepository } from "../repositories/auth.repository";
import type { LoginBody } from "../models/auth.model";

type JwtSigner = {
    sign: (payload: Record<string, string>) => Promise<string>;
};

export type AuthUserResponse = {
    id: string;
    fullName: string;
    email: string;
    role: UserRole;
};

export const authService = {
    async login(body: LoginBody, jwt: JwtSigner) {
        const user = await authRepository.findUserByEmail(body.email);

        if (!user) {
            throw new AppError("Invalid email or password", HTTP_STATUS.UNAUTHORIZED);
        }

        if (user.status !== UserStatus.ACTIVE) {
            throw new AppError("User account is not active", HTTP_STATUS.FORBIDDEN);
        }

        const isPasswordValid = await Bun.password.verify(
            body.password,
            user.passwordHash
        );

        if (!isPasswordValid) {
            throw new AppError("Invalid email or password", HTTP_STATUS.UNAUTHORIZED);
        }

        const responseUser: AuthUserResponse = {
            id: user.id.toString(),
            fullName: user.fullName,
            email: user.email,
            role: user.role
        };

        const accessToken = await jwt.sign({
            sub: responseUser.id,
            role: responseUser.role
        });

        await authRepository.updateLastLoginAt(user.id);

        return {
            user: responseUser,
            accessToken
        };
    }
};

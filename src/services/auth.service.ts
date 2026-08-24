type TokenUser = {
    userId: string;
    email?: string;
    name?: string;
};

export const authService = {
    createTokenPayload(user: TokenUser) {
        return {
            sub: user.userId,
            email: user.email,
            name: user.name
        };
    }
};

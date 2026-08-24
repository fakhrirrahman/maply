import { t } from "elysia";
import { LocationStatus } from "./enums.model";

export const createUserMapLocationSchema = t.Object({
    userMapId: t.String({ pattern: "^\\d+$" }),
    provider: t.Optional(t.Nullable(t.String())),
    providerPlaceId: t.Optional(t.Nullable(t.String())),
    locationName: t.String({ minLength: 1 }),
    latitude: t.String({ examples: ["-6.2000000"] }),
    longitude: t.String({ examples: ["106.8166660"] }),
    address: t.Optional(t.Nullable(t.String())),
    category: t.Optional(t.Nullable(t.String())),
    note: t.Optional(t.Nullable(t.String())),
    sortOrder: t.Optional(t.Number()),
    status: t.Optional(t.Enum(LocationStatus))
});

export const updateUserMapLocationSchema = t.Partial(createUserMapLocationSchema);

export type CreateUserMapLocationBody = typeof createUserMapLocationSchema.static;
export type UpdateUserMapLocationBody = typeof updateUserMapLocationSchema.static;

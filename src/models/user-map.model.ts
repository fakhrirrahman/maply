import { t } from "elysia";
import { MapStatus } from "./enums.model";

export const createUserMapSchema = t.Object({
    userId: t.String({ pattern: "^\\d+$" }),
    mapName: t.Optional(t.String({ minLength: 1 })),
    description: t.Optional(t.Nullable(t.String())),
    status: t.Optional(t.Enum(MapStatus))
});

export const updateUserMapSchema = t.Partial(createUserMapSchema);

export type CreateUserMapBody = typeof createUserMapSchema.static;
export type UpdateUserMapBody = typeof updateUserMapSchema.static;

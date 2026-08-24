import { t } from "elysia";

export const idParamsSchema = t.Object({
    id: t.String({
        pattern: "^\\d+$",
        description: "Numeric resource id"
    })
});

export const paginationQuerySchema = t.Object({
    page: t.Optional(t.String({
        pattern: "^\\d+$",
        examples: ["1"]
    })),
    limit: t.Optional(t.String({
        pattern: "^\\d+$",
        examples: ["10"]
    }))
});

export const successResponseSchema = t.Object({
    success: t.Boolean(),
    message: t.String(),
    data: t.Unknown()
});

export const paginatedResponseSchema = t.Object({
    success: t.Boolean(),
    message: t.String(),
    data: t.Array(t.Unknown()),
    pagination: t.Object({
        page: t.Number(),
        limit: t.Number(),
        total: t.Number(),
        total_pages: t.Number()
    })
});

export const errorResponseSchema = t.Object({
    success: t.Boolean(),
    message: t.String(),
    errors: t.Nullable(t.Unknown())
});

export type IdParams = typeof idParamsSchema.static;
export type PaginationQuery = typeof paginationQuerySchema.static;

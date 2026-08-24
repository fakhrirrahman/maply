import { t } from "elysia";

export const createAgentProfileSchema = t.Object({
    userId: t.String({ pattern: "^\\d+$" }),
    agentCode: t.String({ minLength: 1 }),
    companyName: t.Optional(t.Nullable(t.String())),
    address: t.Optional(t.Nullable(t.String()))
});

export const updateAgentProfileSchema = t.Partial(createAgentProfileSchema);

export type CreateAgentProfileBody = typeof createAgentProfileSchema.static;
export type UpdateAgentProfileBody = typeof updateAgentProfileSchema.static;

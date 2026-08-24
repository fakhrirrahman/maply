import { t } from "elysia";
import { AssignmentStatus } from "./enums.model";

export const createCardAssignmentSchema = t.Object({
    cardId: t.String({ pattern: "^\\d+$" }),
    agentId: t.String({ pattern: "^\\d+$" }),
    assignedBy: t.String({ pattern: "^\\d+$" }),
    status: t.Optional(t.Enum(AssignmentStatus)),
    assignedAt: t.Optional(t.String({ format: "date-time" })),
    unassignedAt: t.Optional(t.Nullable(t.String({ format: "date-time" })))
});

export const updateCardAssignmentSchema = t.Partial(createCardAssignmentSchema);

export type CreateCardAssignmentBody = typeof createCardAssignmentSchema.static;
export type UpdateCardAssignmentBody = typeof updateCardAssignmentSchema.static;

export const UserRole = {
    SUPER_ADMIN: "SUPER_ADMIN",
    ADMIN: "ADMIN",
    AGENT: "AGENT",
    USER: "USER"
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const UserStatus = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    SUSPENDED: "SUSPENDED"
} as const;

export const CardStatus = {
    AVAILABLE: "AVAILABLE",
    ASSIGNED: "ASSIGNED",
    REGISTERED: "REGISTERED",
    PAYMENT_PENDING: "PAYMENT_PENDING",
    ACTIVE: "ACTIVE",
    SUSPENDED: "SUSPENDED",
    EXPIRED: "EXPIRED",
    CANCELLED: "CANCELLED"
} as const;

export const MapStatus = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE"
} as const;

export const LocationStatus = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE"
} as const;

export const PriceStatus = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE"
} as const;

export const TaxType = {
    FIXED: "FIXED",
    PERCENTAGE: "PERCENTAGE"
} as const;

export const FeeType = {
    FIXED: "FIXED",
    PERCENTAGE: "PERCENTAGE"
} as const;

export const PaymentMethodStatus = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE"
} as const;

export const TransactionStatus = {
    PENDING: "PENDING",
    PROCESSING: "PROCESSING",
    PAID: "PAID",
    FAILED: "FAILED",
    EXPIRED: "EXPIRED",
    CANCELLED: "CANCELLED",
    REFUNDED: "REFUNDED"
} as const;

export const PaymentStatus = {
    PENDING: "PENDING",
    PROCESSING: "PROCESSING",
    PAID: "PAID",
    FAILED: "FAILED",
    EXPIRED: "EXPIRED",
    CANCELLED: "CANCELLED",
    REFUNDED: "REFUNDED"
} as const;

export const AssignmentStatus = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE"
} as const;

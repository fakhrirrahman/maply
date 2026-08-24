type PrismaDecimalLike = {
    toString: () => string;
    toJSON?: () => unknown;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object"
        && value !== null
        && Object.getPrototypeOf(value) === Object.prototype;
}

function isDecimalLike(value: unknown): value is PrismaDecimalLike {
    return typeof value === "object"
        && value !== null
        && "toString" in value
        && value.constructor?.name === "Decimal";
}

export function serializePrisma<T>(value: T): unknown {
    if (typeof value === "bigint") {
        return value.toString();
    }

    if (value instanceof Date) {
        return value.toISOString();
    }

    if (isDecimalLike(value)) {
        return value.toString();
    }

    if (Array.isArray(value)) {
        return value.map((item) => serializePrisma(item));
    }

    if (isPlainObject(value)) {
        return Object.fromEntries(
            Object.entries(value).map(([key, item]) => [key, serializePrisma(item)])
        );
    }

    return value;
}

import { app } from "./app";

const DEFAULT_PORT = 3000;
const port = getPort(process.env.PORT);

try {
    app.listen(port);
} catch (error) {
    if (isAddressInUseError(error)) {
        console.error(
            `Port ${port} is already in use. Stop the other process or start Maply with another port, for example: PORT=3001 bun run dev`
        );
    } else {
        console.error("Failed to start Maply API.");
        console.error(error);
    }

    process.exit(1);
}

console.log(`Maply API running at ${app.server?.url}`);

function getPort(value: string | undefined): number {
    if (!value) {
        return DEFAULT_PORT;
    }

    const parsedPort = Number(value);

    if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
        console.error(
            `Invalid PORT "${value}". PORT must be an integer between 1 and 65535.`
        );
        process.exit(1);
    }

    return parsedPort;
}

function isAddressInUseError(error: unknown): boolean {
    return (
        error instanceof Error &&
        ("code" in error
            ? error.code === "EADDRINUSE"
            : error.message.includes("EADDRINUSE"))
    );
}

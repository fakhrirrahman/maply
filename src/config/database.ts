import { SQL } from "bun";

export const db = new SQL({
    adapter: "postgres",
    url: process.env.DATABASE_URL,
})
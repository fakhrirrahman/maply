import { app } from "./app";
import "dotenv/config";

const port = Number(process.env.PORT ?? 3000);

app.listen(port);

console.log(
    `Server running at http://${app.server?.hostname}:${app.server?.port}`
);
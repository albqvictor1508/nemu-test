import "dotenv/config";

import { env } from "./src/common/env";
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./src/drizzle/migrations",
	schema: "./src/drizzle/schema",
	dialect: "postgresql",
	dbCredentials: {
		url: env.POSTGRES_URL,
	},
});

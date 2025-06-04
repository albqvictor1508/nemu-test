import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../common/env";
import { Pool } from "pg";

const pool = new Pool({ connectionString: env.POSTGRES_URL });
export const db = drizzle(pool);

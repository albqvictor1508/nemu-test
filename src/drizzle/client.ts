import {drizzle} from "drizzle-orm/node-postgres"
import postgres from "postgres"
import { env } from "../common/env";

const sql = postgres(env.POSTGRES_URL);
export const db = drizzle({client: sql});
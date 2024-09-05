import { logger } from "@sve/logger";
import type { Config } from "drizzle-kit";
require('dotenv').config({ path: "../../.env" })

logger.debug('DATABASE_URL: ', process.env.DATABASE_URL, 'packages/db', 'drizzle.config.ts');
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

export default {
  schema: "./schemas/*",
  out: "./drizzle",
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  }
} satisfies Config;
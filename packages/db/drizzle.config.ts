import { logger } from "@sve/logger";
import type { Config } from "drizzle-kit";
import { SERVER_ENV } from "@sve/env";
// require('dotenv').config({ path: "../../.env" })

logger.debug('DATABASE_URL: ', SERVER_ENV.DATABASE_URL, 'packages/db', 'drizzle.config.ts');
if (!SERVER_ENV.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

export default {
  schema: "./schemas/*",
  out: "./drizzle",
  driver: 'pg',
  dbCredentials: {
    connectionString: SERVER_ENV.DATABASE_URL!,
  }
} satisfies Config;
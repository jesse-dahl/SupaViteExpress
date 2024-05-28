import type { Config } from "drizzle-kit";
require('dotenv').config({ path: "../../.env" })

console.log(process.env.DATABASE_URL)
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
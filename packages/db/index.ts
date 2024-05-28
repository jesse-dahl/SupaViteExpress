import { drizzle } from 'drizzle-orm/postgres-js'
// import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from 'postgres'
import * as users from "./schemas/users";
require('dotenv').config({ path: "../../.env" })

const schema = {
  ...users
}

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error("Missing Drizzle connection string from .env")
}
const client = postgres(connectionString);
const db = drizzle(client, { schema });

export * as userQueries from "./queries/users";
export * as userMutations from "./mutations/users"
export * from "./types"
export default db;
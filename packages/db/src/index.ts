import { drizzle } from 'drizzle-orm/postgres-js'
// import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from 'postgres'
import * as users from "../schemas/users";
import { SERVER_ENV } from '@sve/env';
// require('dotenv').config({ path: "../../.env" })

const schema = {
  ...users
}

const connectionString = SERVER_ENV.DATABASE_URL!;

if (!connectionString) {
  console.warn("Missing Drizzle connection string from .env");
  process.exit(1);
}
const client = postgres(connectionString);
const db = drizzle(client, { schema });

export * as userQueries from "./queries/users";
export * as userMutations from "./mutations/users"
export * from "../types"
export default db;
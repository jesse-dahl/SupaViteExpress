import { migrate } from 'drizzle-orm/postgres-js/migrator'
import db from '../src/index'

async function main() {
  await migrate(db, { migrationsFolder: "./drizzle" })
}

void main();
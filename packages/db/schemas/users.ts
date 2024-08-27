import { sql } from "drizzle-orm";
import { pgTable, text, varchar, uuid, integer } from "drizzle-orm/pg-core";
// import { sql } from "drizzle-orm";
 
export const users = pgTable('users', {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuid_generate_v4()`)
    .notNull(),
  googleId: text('google_id'),
  fullName: text('full_name'),
  phone: varchar('phone', { length: 256 }),
  refreshTokenVersion: integer("refresh_token_version").default(1).notNull(),
});

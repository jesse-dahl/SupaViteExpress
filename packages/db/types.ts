import type {users} from "./schemas/users";

export type NewUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect
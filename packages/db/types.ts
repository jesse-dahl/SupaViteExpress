import type {users} from "./schemas/users";

export type NewUser = typeof users.$inferInsert;
export type ReturnUser = typeof users.$inferSelect
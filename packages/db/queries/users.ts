import db from "../index"
import { users } from "../schemas/users"
import {
  eq
} from "drizzle-orm"
import type { ReturnUser } from "../types"

export const getUser = async (userId: string): Promise<ReturnUser[]> => {
  const userRes = await db.select().from(users).where(eq(users.id, userId))
  return userRes
}
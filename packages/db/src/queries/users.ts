import db from "../index"
import { users } from "../../schemas/users"
import {
  eq
} from "drizzle-orm"
import type { User } from "../../types"

export const getUser = async (userId: string): Promise<User> => {
  const userRes = await db.selectDistinct().from(users).where(eq(users.id, userId))
  return userRes[0]
}
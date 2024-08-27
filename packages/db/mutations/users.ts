import db from "../index"
import { users } from "../schemas/users"
import type { NewUser, User } from "../types"

export const insertUser = async (user: NewUser): Promise<User[]> => {
  const newUserRes = await db.insert(users).values(user).returning()
  return newUserRes
}
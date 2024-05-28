import { z } from "zod"
import { type User } from "../zod/user.schema"

export type User = z.infer<typeof User>
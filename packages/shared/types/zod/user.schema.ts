import { z } from "zod"

export const User = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters.")
    .max(38, "First name cannot be longer than 38 characters."),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters"),
  email: z
    .string({ required_error: 'Email is required' }).email(),
})
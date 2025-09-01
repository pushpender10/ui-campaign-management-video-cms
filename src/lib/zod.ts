import { z, string } from "zod"
 
export const userRegisterSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    username: z.string().min(3).regex(/^[a-zA-Z0-9_]+$/),
    password: z.string().min(6),
  });

export const credentialsSchema = z.object({
    identifier: z.string().min(3) // email or username
    .min(1, "username is required")
    .min(3,"Username must be more than 3 characters"),
    password: z.string()
    .min(1, "Password is required")
    .min(6,"Password must be more than 6 characters"),
  });
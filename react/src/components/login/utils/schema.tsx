import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email({message: "Please enter a valid email"}),
    password: z.string().min(1, {message: "Please enter a valid password"})
}).required()

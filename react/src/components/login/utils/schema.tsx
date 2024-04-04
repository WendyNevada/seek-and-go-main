import { z } from "zod";

export const customerLoginSchema = z.object({
    email: z.string().email({message: "Please enter a valid email"}),
    password: z.string()
}).required()

export const agencyLoginSchema = z.object({
    email: z.string().email({message: "Please enter a valid email"}),
    password: z.string()
}).required()

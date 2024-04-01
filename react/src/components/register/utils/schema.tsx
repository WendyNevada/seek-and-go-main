import { z } from "zod"

export const customerSchema= z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    dob: z.date({
        required_error: "Please select a date and time",
        invalid_type_error: "That's not a date!",
      }),
    gender: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
}).required()

export const agencySchema= z.object({
    name: z.string().min(1,  {message: "First Name is required" }),
    email: z.string(),
    npwp: z.string(),
    location: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
}).required()

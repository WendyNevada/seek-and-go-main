import { z } from "zod"

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
  );

export const customerSchema= z.object({
    customer_name: z.string(),
    account_name: z.string(),
    email: z.string(),
    phone: z.string().regex(phoneRegex, 'Invalid Number!'),
    birth_date: z.date({
        required_error: "Please select a date and time",
        invalid_type_error: "That's not a date!",
      }),
    gender: z.string(),
    password: z.string(),
    //confirmPassword: z.string(),
    role: z.string()
}).required()

export const agencySchema= z.object({
    agency_name: z.string(),
    account_name: z.string(),
    email: z.string(),
    password: z.string(),
    //confirmPassword: z.string(),
    role: z.string(),
    phone: z.string(),
    npwp: z.string(),
    location: z.string(),
}).required()

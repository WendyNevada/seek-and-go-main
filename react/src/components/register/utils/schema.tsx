import { z } from "zod"

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
  );

export const customerSchema= z.object({
    customer_name: z.string().min(1,  {message: "Name is required" }),
    account_name: z.string().min(1,  {message: "Account Name is required" }),
    email: z.string().email({message: "Please enter a valid email"}),
    //phone : z.string().refine((value) => /^[+]{1}(?:[0-9-()/.]\s?){6,15}[0-9]{1}$/.test(value)),
    phone: z.string().regex(phoneRegex, 'Invalid Number!').min(10,  {message: "Phone number is required"}),
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
    name: z.string().min(1,  {message: "First Name is required" }),
    email: z.string(),
    npwp: z.string(),
    location: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
}).required()

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
    password: z.string().min(8, {message: "Password must be at least 8 characters"}),
    //confirmPassword: z.string(),
    role: z.string()
}).required()
.refine((data)=> data.password === data.confirmPassword,{
    message: "Password do not match!",
    path: ["confirmPassword"],
});

export const agencySchema= z.object({
    agency_name: z.string(),
    account_name: z.string(),
    email: z.string(),
    password: z.string().min(8, {message: "Password must be at least 8 characters"}),
    confirmPassword: z.string(),
    role: z.string(),
    phone: z.string(),
    npwp: z.string().min(15, {message: "NPWP must be 15-16 digit long"}).max(16,{message: "NPWP must be 15-16 digit long"}),
    location: z.string(),
}).required()
.refine((data)=> data.password === data.confirmPassword,{
    message: "Password do not match!",
    path: ["confirmPassword"],
});

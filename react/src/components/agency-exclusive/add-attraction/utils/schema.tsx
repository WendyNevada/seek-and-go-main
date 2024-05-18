import { z } from "zod";

const MAX_FILE_SIZE = 10000000;
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png"
  ];

export const addAttractionSchema = z.object({
    attraction_code: z.string().min(1,  {message: "Product Name is required" }),
    picture: z
        .any()
        .optional()
        .refine((file) => {
            if (!file) return console.log('File not provided') ; // If file is not provided, it's considered valid
            if (!file[0]) return console.log('File is empty'); // If file is empty or not an array, it's invalid
            return file[0]?.size <= MAX_FILE_SIZE && ACCEPTED_IMAGE_TYPES.includes(file[0]?.type);
        }, {
            message: "Invalid image format or size.",
        }),
    //ref_zipcode_id: z.string().min(1,  {message: "Product Description is required" }),
    area_1: z.string().min(1,  {message: "province is required" }),
    area_2: z.string().min(1,  {message: "city is required" }),
    area_3: z.string().min(1,  {message: "district is required" }),
    area_4: z.string().min(1,  {message: "sub district is required" }),
    attraction_name: z.string().min(1,  {message: "Product Price is required" }),
    description: z.string().min(1,  {message: "Product Description is required" }),
    address: z.string().min(1,  {message: "Product Address is required" }),
    is_active: z.boolean(),
    qty: z.coerce.number(),
    promo_code: z.string(),
    base_price: z.coerce.number(),
    promo_code_affiliate: z.string(),
})

export const editAttractionSchema = z.object({
    attraction_code: z.string(),
    picture: z
        .any()
        .optional()
        .refine((file) => {
            if (!file || !file[0]) return true;
            return file[0]?.size <= MAX_FILE_SIZE && ACCEPTED_IMAGE_TYPES.includes(file[0]?.type);
        }, {
            message: "Invalid image format or size.",
        }),
    //ref_zipcode_id: z.string().min(1,  {message: "Product Description is required" }),,
    attraction_name: z.string(),
    description: z.string(),
    address: z.string(),
    address2 : z.string(),
    is_active: z.boolean(),
    qty: z.coerce.number(),
    promo_code: z.string(),
    base_price: z.coerce.number(),
})

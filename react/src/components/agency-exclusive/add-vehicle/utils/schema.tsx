import { z } from "zod";

const MAX_FILE_SIZE = 10000000;
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png"
  ];

export const addVehicleSchema = z.object({
    vehicle_code: z.string().min(1,  {message: "Product Name is required" }),
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
    description: z.string().min(1,  {message: "Product Description is required" }),
    area_1: z.string().min(1,  {message: "province is required" }),
    area_2: z.string().min(1,  {message: "city is required" }),
    area_3: z.string().min(1,  {message: "district is required" }),
    area_4: z.string().min(1,  {message: "sub district is required" }),
    vehicle_type : z.string().min(1,  {message: "Vehicle Type is required" }),
    vehicle_brand : z.string().min(1,  {message: "Vehicle Brand is required" }),
    vehicle_seat : z.number().min(1,  {message: "Vehicle Seat is required" }),
    vehicle_series : z.string().min(1,  {message: "Vehicle Series is required" }),
    vehicle_model : z.string().min(1,  {message: "Vehicle Model is required" }),
    vehicle_year : z.number().min(1,  {message: "Vehicle Year is required" }),
    vehicle_name : z.string().min(1,  {message: "Vehicle Name is required" }),
    with_driver : z.boolean(),
    address : z.string().min(1,  {message: "Vehicle Address is required" }),
    qty : z.coerce.number(),
    promo_code: z.string().nullable(),
    base_price: z.coerce.number(),
    //promo_code_affiliate: z.string(),
})

export const editVehicleSchema = z.object({
    vehicle_code: z.string().min(1,  {message: "Product Name is required" }),
    picture: z
        .any()
        .optional()
        .refine((file) => {
            if (!file || !file[0]) return true;
            return file[0]?.size <= MAX_FILE_SIZE && ACCEPTED_IMAGE_TYPES.includes(file[0]?.type);
        }, {
            message: "Invalid image format or size.",
        }),
    vehicle_type : z.string().min(1,  {message: "Vehicle Type is required" }),
    vehicle_name : z.string().min(1,  {message: "Vehicle Name is required" }), //vehicle_name
    vehicle_brand : z.string().min(1,  {message: "Vehicle Brand is required" }),
    vehicle_series : z.string().min(1,  {message: "Vehicle Series is required" }),
    vehicle_model : z.string().min(1,  {message: "Vehicle Model is required" }),
    vehicle_seat : z.number().min(1,  {message: "Vehicle Seat is required" }),
    vehicle_year : z.number().min(1,  {message: "Vehicle Year is required" }),
    description: z.string().min(1,  {message: "Product Description is required" }),
    address: z.string().min(1,  {message: "Product Address is required" }),
    //address2 : z.string(),
    with_driver : z.boolean(),
    //is_active: z.boolean(),
    qty: z.coerce.number(),
    promo_code: z.string().nullable(),
    base_price: z.coerce.number(),
})

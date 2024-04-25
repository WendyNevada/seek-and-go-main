import { z } from "zod";
import { ChangeEvent } from 'react';

const MAX_FILE_SIZE = 10000000;
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png"
];

export const addHotelSchema = z.object({
    hotel_code: z.string().min(1,  {message: "Product Name is required" }),
    hotel_name: z.string().min(1,  {message: "Product Name is required" }),
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
    address: z.string().min(1,  {message: "Address is required" }),
    rating: z.coerce.number(),
    qty: z.coerce.number(),
    promo_code: z.string(),
    base_price: z.coerce.number(),
})

export const editHotelSchema = z.object({
    hotel_code: z.string().min(1,  {message: "Product Name is required" }),
    hotel_name: z.string().min(1,  {message: "Product Name is required" }),
    picture: z
        .any()
        .optional()
        .refine((file) => {
            if (!file || !file[0]) return true;
            return file[0]?.size <= MAX_FILE_SIZE && ACCEPTED_IMAGE_TYPES.includes(file[0]?.type);
        }, {
            message: "Invalid image format or size.",
        }),
    description: z.string().min(1,  {message: "Product Description is required" }),
    address: z.string().min(1,  {message: "Address is required" }),
    qty: z.coerce.number(),
    promo_code: z.string(),
    base_price: z.coerce.number(),
})

// imageUtils.ts
export const handleImageUpload = (event: ChangeEvent<HTMLInputElement>, setImageUrl: React.Dispatch<React.SetStateAction<string | undefined>>) => {
    const file = event.target.files && event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        const result = reader.result as string
        setImageUrl(result);
    };

    if (file) {
        reader.readAsDataURL(file);
    }
    else {
        setImageUrl(undefined);
    }
};



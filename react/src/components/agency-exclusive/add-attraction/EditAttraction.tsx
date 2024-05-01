import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { editAttractionSchema } from './utils/schema'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import axiosClient from '@/axios.client'
import { toast } from '@/components/ui/use-toast'
import axios, { AxiosError } from 'axios'
import { Required } from '@/components/ui/Custom/required'

const EditAttraction = ({ ref_attraction_id }: { ref_attraction_id: number }) => {
    const enviUrl = import.meta.env.VITE_API_BASE_URL;
    const [imageUrl, setImageUrl] = useState('');
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof editAttractionSchema>>({
        resolver: zodResolver(editAttractionSchema),
        defaultValues: {
            attraction_code: "",
            picture: undefined,
            attraction_name: "",
            description: "",
            address: "",
            address2: "",
            is_active: true,
            qty: 0,
            promo_code: "",
            base_price: 0
        }
    })

    const fileRef = form.register("picture");

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result as string
            setImageUrl(result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.post('v1/GetAttractionById', { ref_attraction_id: ref_attraction_id });

                // patch data to form
                form.setValue('attraction_code', response.data.attraction.attraction_code);
                form.setValue('attraction_name', response.data.attraction.attraction_name);
                form.setValue('description', response.data.attraction.description);
                form.setValue('address', response.data.attraction.address);
                form.setValue('address2', response.data.address);
                form.setValue('qty', response.data.attraction.qty);
                form.setValue('promo_code', response.data.attraction.promo_code ? response.data.attraction.promo_code : '');
                form.setValue('base_price', response.data.base_price);
                setImageUrl(enviUrl + response.data.picture_url)

            } catch (error) {
                console.error('Error fetching attraction data:', error);
            }

        };

        fetchData();
    }, [ref_attraction_id]);

    const onSubmit = async (values: z.infer<typeof editAttractionSchema>) => {
        const formData = new FormData();
        formData.append('ref_attraction_id',ref_attraction_id.toString());
        //formData.append('attraction_code', values.attraction_code);
        formData.append('attraction_name', values.attraction_name);
        formData.append('description', values.description);
        formData.append('address', values.address);
        formData.append('qty', values.qty.toString());
        formData.append('promo_code', values.promo_code !== null && values.promo_code !== undefined ? String(values.promo_code) : 'null');
        formData.append('base_price', values.base_price.toString());

        if (values.picture[0]) {
            // If user uploads an image, append the image file
            formData.append('picture', values.picture[0]);
        } else {
            // If user doesn't upload an image, append the image URL
            formData.append('picture_url', imageUrl);
        }

        try{
            await axiosClient.post('/v1/EditAttractionById', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Set the content type to multipart/form-data
                }
            });
            toast({
                variant: "success",
                description: "Item added."
            });
            navigate('/Agency');
        }catch(response){
            const axiosError = response as AxiosError; // Cast the error to AxiosError
            if (axios.isAxiosError(response)) { // Check if the error is an AxiosError
                toast({
                    variant: "destructive",
                    description: (axiosError.response?.data as { message: string })?.message,
                });
            }
        }
    }

    return (
        <div className='min-h-50 w-50 p-0 sm:p-12'>
            <div className="mx-auto max-w-xl px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <h1 className="text-2xl font-bold mb-8 text-center">Edit Attraction</h1>

                                <FormField
                                    control={form.control}
                                    name="attraction_code"
                                    render={({ field }) => (
                                        <FormItem className="custom-field">
                                            <FormLabel>{"Attraction Code"}</FormLabel>
                                            <Required/>
                                            <FormMessage />
                                            <FormControl>
                                                <Input
                                                    placeholder={"Attraction Code"}
                                                    {...field}
                                                    onChange={field.onChange}
                                                    disabled
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="picture"
                                    render={() => (
                                        <FormItem className="custom-field">
                                            <FormLabel>{"Picture"}</FormLabel>
                                            <FormMessage />
                                            <FormControl>
                                                <Input
                                                    id="picture"
                                                    type="file"
                                                    accept='.jpg, .jpeg, .png'
                                                    {...fileRef}
                                                    onChange={handleImageUpload}
                                                />
                                            </FormControl>
                                            {imageUrl && (
                                                <div>
                                                    <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100%', marginTop: '10px' }} />
                                                </div>
                                            )}
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="attraction_name"
                                    render={({ field }) => (
                                        <FormItem className="custom-field">
                                            <FormLabel>{"Attraction Name"}</FormLabel>
                                            <Required/>
                                            <FormMessage />
                                            <FormControl>
                                                <Input
                                                    placeholder={"Attraction Name"}
                                                    {...field}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem className="custom-field">
                                            <FormLabel>{"Description"}</FormLabel>
                                            <Required/>
                                            <FormMessage />
                                            <FormControl>
                                                <Textarea
                                                    placeholder={field.name}
                                                    {...field}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem className="custom-field">
                                            <FormLabel>{"Nama Jalan"}</FormLabel>
                                            <Required/>
                                            <FormMessage />
                                            <FormControl>
                                                <Input
                                                    placeholder={"Address"}
                                                    {...field}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address2"
                                    render={({ field }) => (
                                        <FormItem className="custom-field">
                                            <FormLabel>{"Address"}</FormLabel>
                                            <Required/>
                                            <FormMessage />
                                            <FormControl>
                                                <Textarea
                                                    placeholder={"Address"}
                                                    {...field}
                                                    onChange={field.onChange}
                                                    disabled
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="qty"
                                    render={({ field }) => (
                                        <FormItem className="custom-field">
                                            <FormLabel>{"QTY"}</FormLabel>
                                            <Required/>
                                            <FormMessage />
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    {...field}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="promo_code"
                                    render={({ field }) => (
                                        <FormItem className="custom-field">
                                            <FormLabel>{"Promo Code"}</FormLabel>
                                            <FormMessage />
                                            <FormControl>
                                                <Input
                                                    placeholder={"Promo Code"}
                                                    {...field}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="base_price"
                                    render={({ field }) => (
                                        <FormItem className="custom-field">
                                            <FormLabel>{"Base Price"}</FormLabel>
                                            <Required/>
                                            {/* <FormMessage /> */}
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    {...field}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <div className="justify-center flex">
                                    <Button type="submit" className='mt-4'>Edit Attraction Product
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
        </div>
    )
}

export default EditAttraction

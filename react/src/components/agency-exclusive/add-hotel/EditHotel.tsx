import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { ChangeEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { editHotelSchema, handleImageUpload } from './utils/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import axiosClient from '@/axios.client'
import { toast } from '@/components/ui/use-toast'
import axios, { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { Required } from '@/components/ui/Custom/required'
import { useTranslation } from 'react-i18next'

const EditHotel = ({ref_hotel_id} : {ref_hotel_id: number}) => {
    const { t } = useTranslation();
    const [imageUrl, setImageUrl] = useState<string|undefined>('');
    const navigate = useNavigate()
    const enviUrl = import.meta.env.VITE_API_BASE_URL;

    const form = useForm<z.infer<typeof editHotelSchema>>({
        resolver : zodResolver(editHotelSchema),
        defaultValues : {
            hotel_code : "",
            hotel_name : "",
            picture : undefined,
            description : "",
            address: "",
            qty: 0,
            promo_code: "",
            base_price: 0
        }
    })

    const fileRef = form.register("picture");

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        handleImageUpload(event, setImageUrl);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.post('v1/GetHotelById', { ref_hotel_id: ref_hotel_id });

                // patch data to form
                setImageUrl(enviUrl + response.data.picture_url)
                form.setValue('base_price', response.data.base_price);
                form.setValue('hotel_code', response.data.hotel.hotel_code);
                form.setValue('hotel_name', response.data.hotel.hotel_name);
                form.setValue('description', response.data.hotel.description);
                form.setValue('address', response.data.hotel.address);
                form.setValue('qty', response.data.hotel.qty);
                form.setValue('promo_code', response.data.attraction.promo_code ? response.data.attraction.promo_code : '');

                //form.setValue('address2', response.data.address2);
            } catch (error) {
                console.error('Error fetching attraction data:', error);
            }

        };

        fetchData();
    }, [ref_hotel_id]);

    const onSubmit = async(values: z.infer<typeof editHotelSchema>) => {
        console.log(values)
        const formData = new FormData();
        formData.append('ref_hotel_id', ref_hotel_id.toString());
        formData.append('hotel_code', values.hotel_code);
        formData.append('hotel_name', values.hotel_name);
        formData.append('description', values.description);
        formData.append('address', values.address);
        formData.append('qty', values.qty.toString());
        formData.append('base_price', values.base_price.toString());
        formData.append('promo_code', values.promo_code !== null && values.promo_code !== undefined ? String(values.promo_code) : 'null');

        if (values.picture[0]) {
            formData.append('picture', values.picture[0]);
        } else {
            formData.append('picture_url', imageUrl || '');
        }

        try {
            await axiosClient.post('/v1/EditHotelById', formData, {
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
        <div className="min-h-50 w-50 p-0 sm:p-12">
            <div className="mx-auto max-w-2xl px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <h1 className="text-2xl font-bold mb-8 text-center">{t('Edit Hotel')}</h1>

                        <div className="flex flex-row space-x-4">
                            <FormField
                                control={form.control}
                                name="hotel_code"
                                render={({ field }) => (
                                    <FormItem className="custom-field">
                                        <FormLabel>{t('Hotel Code')}</FormLabel>
                                        <Required/>
                                        <FormMessage />
                                        <FormControl className='w-full'>
                                            <Input
                                                placeholder={t('Hotel Code')}
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
                                name="hotel_name"
                                render={({ field }) => (
                                    <FormItem className="custom-field">
                                        <FormLabel>{t('Hotel Name')}</FormLabel>
                                        <Required/>
                                        <FormMessage />
                                        <FormControl className='w-full'>
                                            <Input
                                                placeholder={t('Hotel Name')}
                                                {...field}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="picture"
                            render={() => (
                                <FormItem className="custom-field">
                                    <FormLabel>{t('Picture')}</FormLabel>
                                    <Required/>
                                    <FormMessage />
                                    <FormControl>
                                        <Input
                                            id="picture"
                                            type="file"
                                            accept='.jpg, .jpeg, .png'
                                            {...fileRef}
                                            onChange={handleChange}
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
                            name="description"
                            render={({ field }) => (
                                <FormItem className="custom-field">
                                    <FormLabel>{t('Description')}</FormLabel>
                                    <Required/>
                                    <FormMessage />
                                    <FormControl>
                                        <Textarea
                                            placeholder={t('Description')}
                                            {...field}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-row space-x-4">
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem className="custom-field">
                                        <FormLabel>{t('Street Address')}</FormLabel>
                                        <Required/>
                                        <FormMessage />
                                        <FormControl className='w-full'>
                                            <Input
                                                placeholder={t('Street Address')}
                                                {...field}
                                                onChange={field.onChange}
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
                                        <FormLabel>{t('QTY')}</FormLabel>
                                        <Required/>
                                        <FormMessage />
                                        <FormControl className='w-full'>
                                            <Input
                                                type='number'
                                                placeholder={"Input Qty"}
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
                                        <FormLabel>{t('Promo Code')}</FormLabel>
                                        <FormMessage />
                                        <FormControl className='w-full'>
                                            <Input
                                                placeholder={t('Promo Code')}
                                                {...field}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="base_price"
                            render={({ field }) => (
                                <FormItem className="custom-field">
                                    <FormLabel>{t('Price (perhari)')}</FormLabel>
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

                        <div className="justify-center flex">
                            <Button type="submit" className='mt-4'>{t('Edit Hotel Product')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default EditHotel

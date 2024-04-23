import React, { ChangeEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axiosClient from '@/axios.client';
import { editVehicleSchema } from './utils/schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EditVehicle = ({ref_vehicle_id} : {ref_vehicle_id:number}) => {
    const enviUrl = import.meta.env.VITE_API_BASE_URL;
    const [imageUrl, setImageUrl] = useState('');
    const navigate = useNavigate()
    const currentYear = new Date().getFullYear();
    const years: number[] = Array.from({ length: currentYear - 1949 }, (_, index) => currentYear - index);

    const form = useForm<z.infer<typeof editVehicleSchema>>({
        resolver: zodResolver(editVehicleSchema),
        defaultValues: {
            vehicle_code: "",
            picture: undefined,
            vehicle_type: "",
            vehicle_name:"",
            vehicle_brand:"",
            vehicle_series:"",
            vehicle_model:"",
            vehicle_seat:0,
            vehicle_year:0,
            with_driver:false,
            description:"",
            address:"",
            address2:"",
            qty:0,
            promo_code:"",
            base_price:0
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

    const onSubmit = async (values: z.infer<typeof editVehicleSchema>) => {
        console.log(values);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.post('v1/GetVehicleById', { ref_vehicle_id: ref_vehicle_id });

                // patch data to form
                form.setValue('vehicle_code', response.data.vehicle.vehicle_code);
                form.setValue('vehicle_type', response.data.vehicle.vehicle_type);
                form.setValue('vehicle_name', response.data.vehicle.vehicle_name);
                form.setValue('vehicle_brand', response.data.vehicle.vehicle_brand);
                form.setValue('vehicle_series', response.data.vehicle.vehicle_series);
                form.setValue('vehicle_model', response.data.vehicle.vehicle_model);
                form.setValue('vehicle_seat', response.data.vehicle.vehicle_seat);
                form.setValue('vehicle_year', response.data.vehicle.vehicle_year);
                form.setValue('with_driver', response.data.vehicle.with_driver);
                form.setValue('description', response.data.vehicle.description);
                form.setValue('address', response.data.vehicle.address);
                form.setValue('qty', response.data.vehicle.qty);
                form.setValue('promo_code', response.data.vehicle.promo_code);

                form.setValue('address2', response.data.address2);
                form.setValue('qty', response.data.attraction.qty);
                form.setValue('promo_code', response.data.attraction.promo_code);

                form.setValue('base_price', response.data.base_price);
                setImageUrl(enviUrl + response.data.picture_url)

            } catch (error) {
                console.error('Error fetching attraction data:', error);
            }

        };

        fetchData();
    }, [ref_vehicle_id]);

    //editVehicleSchema
    return (
        <div className="min-h-50 w-50 p-0 sm:p-12">
            <div className="mx-auto max-w-2xl px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <h1 className="text-2xl font-bold mb-8 text-center">Edit Attraction</h1>

                                <div className="flex flex-row space-x-4">
                                    <FormField
                                        control={form.control}
                                        name="vehicle_code"
                                        render={({ field }) => (
                                            <FormItem className="custom-field">
                                                <FormLabel>{"Vehicle Code"}</FormLabel>
                                                <FormMessage />
                                                <FormControl className='w-full'>
                                                    <Input
                                                        placeholder={"Vehilce Code"}
                                                        {...field}
                                                        onChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="vehicle_name"
                                        render={({ field }) => (
                                            <FormItem className="custom-field">
                                                <FormLabel>{"Vehicle Name"}</FormLabel>
                                                <FormMessage />
                                                <FormControl>
                                                    <Input
                                                        placeholder={"Vehilce Name"}
                                                        {...field}
                                                        onChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                    control={form.control}
                                    name="vehicle_year"
                                    render={() => (
                                        <FormItem className="custom-field">
                                            <FormLabel>{"Vehicle Year"}</FormLabel>
                                            <FormMessage />
                                            <FormControl>
                                                <Select
                                                    onValueChange={(newValue) => form.setValue("vehicle_year", parseInt(newValue, 10))}>
                                                    <SelectTrigger className='w-40'>
                                                        <SelectValue placeholder={form.watch("vehicle_year").toString() || "Select Year"}/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                            {years.map((year) => (
                                                                <SelectItem
                                                                    key={year}
                                                                    value={year.toString()}
                                                                >
                                                                    {year}
                                                                </SelectItem>
                                                            ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                </div>

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

export default EditVehicle

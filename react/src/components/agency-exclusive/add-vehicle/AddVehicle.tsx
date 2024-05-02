import { zodResolver } from '@hookform/resolvers/zod'
import React, { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { addVehicleSchema } from './utils/schema'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ProvinceCombobox } from '../add-attraction/ComboBox.tsx/ProvinceComboBox'
import { CityCombobox } from '../add-attraction/ComboBox.tsx/cityComboBox/CityCombobox'
import { KecamatanCombobox } from '../add-attraction/ComboBox.tsx/kecamatanCombobox/KecamatanCombobox'
import { KelurahanCombobox } from '../add-attraction/ComboBox.tsx/kelurahanCombobox/KelurahanCombobox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import axiosClient from '@/axios.client'
import { toast } from '@/components/ui/use-toast'
import { useLogin } from '@/context/LoginContext'
import { useNavigate } from 'react-router-dom'
import axios, { AxiosError } from 'axios'
import { Textarea } from '@/components/ui/textarea'
import { Required } from '@/components/ui/Custom/required'

const AddVehicle = () => {
    const [imageUrl, setImageUrl] = useState('');
    const currentYear = new Date().getFullYear();
    const years: number[] = Array.from({ length: currentYear - 1949 }, (_, index) => currentYear - index);
    const navigate = useNavigate();
    const { user } = useLogin();

    const form = useForm<z.infer<typeof addVehicleSchema>>({
        resolver: zodResolver(addVehicleSchema),
        defaultValues: {
            vehicle_code: "",
            vehicle_name : "",
            picture: undefined,
            description: "",
            area_1: "",
            area_2: "",
            area_3: "",
            area_4: "",
            vehicle_type : "",
            vehicle_brand : "",
            vehicle_seat : 0,
            vehicle_series : "",
            vehicle_model : "",
            vehicle_year : 2024,
            with_driver : false,
            address : "",
            qty : 0,
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

    const handleProvinceSelect = (province:string) => {
        form.setValue("area_1",province);
        console.log('province : ', province);
    };

    const handleCitySelect = (city:string) => {
        form.setValue("area_2",city);
    }

    const handleKecamatanSelect = (kecamatan:string) => {
        form.setValue("area_3",kecamatan);
    }

    const handleKelurahanSelect = (kelurahan:string) => {
        form.setValue("area_4",kelurahan);
    }

    const onSubmit = async (values: z.infer<typeof addVehicleSchema>) => {
        const formData = new FormData();
        formData.append('agency_id', String(user?.agency_id)); // Assuming agency_id is a string
        formData.append('vehicle_code', values.vehicle_code);
        formData.append('description', values.description);
        formData.append('vehicle_name', values.vehicle_name);
        formData.append('area_1', values.area_1);
        formData.append('area_2', values.area_2);
        formData.append('area_3', values.area_3);
        formData.append('area_4', values.area_4);
        formData.append('vehicle_type', values.vehicle_type);
        formData.append('vehicle_brand', values.vehicle_brand);
        formData.append('vehicle_seat', values.vehicle_seat.toString());
        formData.append('vehicle_series', values.vehicle_series);
        formData.append('vehicle_model', values.vehicle_model);
        formData.append('vehicle_year', values.vehicle_year.toString());
        formData.append('with_driver', values.with_driver ? '1' : '0');
        formData.append('address', values.address);
        formData.append('qty', values.qty.toString());
        formData.append('promo_code', values.promo_code !== null && values.promo_code !== undefined ? String(values.promo_code) : '');
        formData.append('base_price', values.base_price.toString());
        //formData.append('promo_code_affiliate', values.promo_code_affiliate);

        formData.append('picture', values.picture[0]);

        try{
            await axiosClient.post('/v1/AddVehicle', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Set the content type to multipart/form-data
                }
            });
            toast({
                variant: "success",
                description: "Item added."
            });
            navigate('/Agency');
        }catch (response) {
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
                        <h1 className="text-2xl font-bold mb-8 text-center">Add Vehicle</h1>

                        <div className="flex flex-row space-x-4">
                            <FormField
                                control={form.control}
                                name="vehicle_code"
                                render={({ field }) => (
                                    <FormItem className="custom-field">
                                        <FormLabel>{"Vehicle Code"}</FormLabel>
                                        <Required/>
                                        <FormMessage />
                                        <FormControl className='w-full'>
                                            <Input
                                                placeholder={"Vehilce Code"}
                                                {...field}
                                                onChange={field.onChange}
                                                maxLength={7} //Add Felix
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
                                        <Required/>
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
                                    <Required/>
                                    <FormMessage />
                                    <FormControl>
                                        <Select onValueChange={(newValue) => form.setValue("vehicle_year", parseInt(newValue, 10))}>
                                            <SelectTrigger className='w-40'>
                                                <SelectValue placeholder="Select Year" />
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

                        <div className="flex flex-row">
                                <FormField
                                    control={form.control}
                                    name="area_1"
                                    render={() => (
                                        <FormItem className="custom-field mt-4 mr-8 flex flex-col">
                                            <FormLabel>{"Province"}<Required/></FormLabel>
                                            <FormMessage />
                                            <FormControl>
                                                <ProvinceCombobox onSelectProvince={handleProvinceSelect}/>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="area_2"
                                    render={() => (
                                        <FormItem className="custom-field mt-4 flex flex-col">
                                            <FormLabel>{"City"}<Required/></FormLabel>
                                            <FormMessage />
                                            <FormControl>
                                                <CityCombobox onSelectCity={handleCitySelect} selectedProvince={form.watch("area_1")}/>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                        </div>

                        <div className="flex flex-row">
                            <FormField
                                control={form.control}
                                name="area_3"
                                render={() => (
                                    <FormItem className="custom-field mt-4 mr-8 flex flex-col">
                                        <FormLabel>{"District"}<Required/></FormLabel>
                                        <FormMessage />
                                        <FormControl>
                                            <KecamatanCombobox onSelectKecamatan={handleKecamatanSelect} selectedCity={form.watch("area_2")}/>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="area_4"
                                render={() => (
                                    <FormItem className="custom-field mt-4 flex flex-col">
                                        <FormLabel>{"Subdistrict"}<Required/></FormLabel>
                                        <FormMessage />
                                        <FormControl>
                                            <KelurahanCombobox onSelectKelurahan={handleKelurahanSelect} selectedKecamatan={form.watch("area_3")}/>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex flex-row">
                            <FormField
                                control={form.control}
                                name="vehicle_type"
                                render={() => (
                                    <FormItem className="custom-field mr-10">
                                        <FormLabel>{"Vehicle Type"}<Required/></FormLabel>
                                        <FormMessage />
                                        <FormControl>
                                            <Select
                                                onValueChange={(newValue) => form.setValue("vehicle_type", newValue)}>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Vehicle Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Car">Car</SelectItem>
                                                    <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="vehicle_seat"
                                render={() => (
                                    <FormItem className="custom-field ml-3">
                                        <FormLabel>{"Vehicle Seat"}<Required/></FormLabel>
                                        <FormMessage />
                                        <FormControl>
                                            <Select onValueChange={(newValue) => form.setValue("vehicle_seat", parseInt(newValue))}>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Vehicle Seat" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="2">2 Seat</SelectItem>
                                                    <SelectItem value="4">4 Seat</SelectItem>
                                                    <SelectItem value="6">6 Seat</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex flex-row space-x-4">
                            <FormField
                                control={form.control}
                                name="vehicle_brand"
                                render={({ field }) => (
                                    <FormItem className="custom-field">
                                        <FormLabel>{"Vehicle Brand"}</FormLabel>
                                        <Required/>
                                        <FormMessage />
                                        <FormControl>
                                            <Input
                                                placeholder={"Input Vehicle Brand"}
                                                {...field}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="vehicle_series"
                                render={({ field }) => (
                                    <FormItem className="custom-field">
                                        <FormLabel>{"Vehicle Series"}</FormLabel>
                                        <Required/>
                                        <FormMessage />
                                        <FormControl>
                                            <Input
                                                placeholder={"Input Vehicle Series"}
                                                {...field}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="vehicle_model"
                                render={({ field }) => (
                                    <FormItem className="custom-field">
                                        <FormLabel>{"Vehicle Model"}</FormLabel>
                                        <Required/>
                                        <FormMessage />
                                        <FormControl>
                                            <Input
                                                placeholder={"Input Vehicle Model"}
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
                            name="with_driver"
                            render={({ field }) => (
                                <FormItem className="custom-field mt-2">
                                    <FormLabel className='mr-4 align-middle'>{"With Driver?"}</FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            //onChange={field.onChange}
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
                                        <FormLabel>{"Address"}<Required/></FormLabel>
                                        <FormMessage />
                                        <FormControl className='w-full'>
                                            <Input
                                                placeholder={"Input Address"}
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
                                        <FormLabel>{"QTY"}<Required/></FormLabel>
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
                                        <FormLabel>{"Promo Code"}<Required/></FormLabel>
                                        <FormMessage />
                                        <FormControl className='w-full'>
                                            <Input
                                                placeholder={"Promo Code"}
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
                                    <FormLabel>{"Base Price (perhari)"}<Required/></FormLabel>
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
                        {/* <FormField
                            control={form.control}
                            name="promo_code_affiliate"
                            render={({ field }) => (
                                <FormItem className="custom-field">
                                    <FormLabel>{"Promo Code Affiliate"}</FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <Input
                                            placeholder={"Promo Code Affiliate"}
                                            {...field}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        /> */}
                        <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="custom-field">
                                        <FormLabel>{"Description"}<Required/></FormLabel>
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

                        <div className="justify-center flex">
                            <Button type="submit" className='mt-6'>Add Vehicle Product
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default AddVehicle

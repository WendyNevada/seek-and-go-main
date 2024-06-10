import { ChangeEvent, useEffect, useState } from 'react'
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
import { toast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Required } from '@/components/ui/Custom/required';
import { useTranslation } from 'react-i18next';
import HashLoader from 'react-spinners/HashLoader';

const EditVehicle = ({ref_vehicle_id} : {ref_vehicle_id:number}) => {
    const { t } = useTranslation();
    const enviUrl = import.meta.env.VITE_API_BASE_URL;
    const [imageUrl, setImageUrl] = useState('');
    const navigate = useNavigate()
    const currentYear = new Date().getFullYear();
    const years: number[] = Array.from({ length: currentYear - 1949 }, (_, index) => currentYear - index);
    const [ loading, setLoading ] = useState(true);

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
            //address2:"",
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.post('v1/GetVehicleById', { ref_vehicle_id: ref_vehicle_id });

                // patch data to form
                setImageUrl(enviUrl + response.data.picture_url)
                form.setValue('base_price', response.data.base_price);
                form.setValue('vehicle_code', response.data.vehicle.vehicle_code);
                form.setValue('vehicle_type', response.data.vehicle.vehicle_type);
                form.setValue('vehicle_name', response.data.vehicle.vehicle_name);
                form.setValue('vehicle_brand', response.data.vehicle.vehicle_brand);
                form.setValue('vehicle_series', response.data.vehicle.vehicle_series);
                form.setValue('vehicle_model', response.data.vehicle.vehicle_model);
                form.setValue('vehicle_seat', response.data.vehicle.vehicle_seat);
                form.setValue('vehicle_year', parseInt(response.data.vehicle.vehicle_year));
                form.setValue('with_driver', response.data.vehicle.with_driver === 1 ? true : false);
                form.setValue('description', response.data.vehicle.description);
                form.setValue('address', response.data.vehicle.address);
                form.setValue('qty', response.data.vehicle.qty);
                form.setValue('promo_code', response.data.vehicle.promo_code ? response.data.attraction.promo_code : '');

                //form.setValue('address2', response.data.address2);
            } catch (error) {
                console.error('Error fetching attraction data:', error);
            } finally {
                setLoading(false);
            }

        };

        fetchData();
    }, [ref_vehicle_id]);

    const onSubmit = async (values: z.infer<typeof editVehicleSchema>) => {
        const formData = new FormData();
        formData.append('ref_vehicle_id', ref_vehicle_id.toString());
        formData.append('vehicle_code', values.vehicle_code);
        formData.append('vehicle_type', values.vehicle_type);
        formData.append('vehicle_brand', values.vehicle_brand);
        formData.append('vehicle_series', values.vehicle_series);
        formData.append('vehicle_model', values.vehicle_model);
        formData.append('vehicle_seat', values.vehicle_seat.toString());
        formData.append('vehicle_year', values.vehicle_year.toString());
        formData.append('vehicle_name', values.vehicle_name);
        formData.append('description', values.description);
        formData.append('with_driver', values.with_driver ? '1' : '0');
        formData.append('address', values.address);
        //formData.append('address', values.address);
        formData.append('qty', values.qty.toString());
        formData.append('promo_code', values.promo_code !== null && values.promo_code !== undefined ? String(values.promo_code) : '');
        formData.append('base_price', values.base_price.toString());

        if (values.picture[0]) {
            formData.append('picture', values.picture[0]);
        } else {
            formData.append('picture_url', imageUrl);
        }

        try{
            await axiosClient.post('/v1/EditVehicleById', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Set the content type to multipart/form-data
                }
            });
            toast({
                variant: "success",
                description: "Item Edited"
            });
            navigate('/Agency/Product');
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

    //editVehicleSchema
    return (
        <div className="min-h-50 w-50 p-0 sm:p-12">
            <div className="mx-auto max-w-2xl px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <HashLoader size={50} color={"#123abc"} loading={loading} />
                    </div>
                ) : (
                <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <h1 className="text-2xl font-bold mb-8 text-center">{t('Edit Vehicle')}</h1>

                                <div className="flex flex-row space-x-4">
                                    <FormField
                                        control={form.control}
                                        name="vehicle_code"
                                        render={({ field }) => (
                                            <FormItem className="custom-field">
                                                <FormLabel>{t('Vehicle Code')}</FormLabel>
                                                <Required/>
                                                <FormMessage />
                                                <FormControl className='w-full'>
                                                    <Input
                                                        placeholder={t('Vehicle Code')}
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
                                        name="vehicle_name"
                                        render={({ field }) => (
                                            <FormItem className="custom-field">
                                                <FormLabel>{t('Vehicle Name')}</FormLabel>
                                                <Required/>
                                                <FormMessage />
                                                <FormControl>
                                                    <Input
                                                        placeholder={t('Vehicle Name')}
                                                        {...field}
                                                        onChange={field.onChange}
                                                        maxLength={100}
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
                                            <FormLabel>{t('Vehicle Year')}</FormLabel>
                                            <Required/>
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
                                        name="vehicle_type"
                                        render={() => (
                                            <FormItem className="custom-field mr-10">
                                                <FormLabel>{t('Vehicle Type')}</FormLabel>
                                                <Required/>
                                                <FormMessage />
                                                <FormControl>
                                                    <Select onValueChange={(newValue) => form.setValue("vehicle_type", newValue)}>
                                                        <SelectTrigger className="w-[180px]">
                                                            <SelectValue placeholder={form.watch("vehicle_type").toString() || "Vehicle Type"} />
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
                                                <FormLabel>{t('Vehicle Seat')}</FormLabel>
                                                <Required/>
                                                <FormMessage />
                                                <FormControl>
                                                    <Select onValueChange={(newValue) => form.setValue("vehicle_seat", parseInt(newValue))}>
                                                        <SelectTrigger className="w-[180px]">
                                                            <SelectValue placeholder={form.watch("vehicle_seat").toString().concat(" Seat") || "Vehicle Seat"} />
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
                                                <FormLabel>{t('Vehicle Brand')}</FormLabel>
                                                <Required/>
                                                <FormMessage />
                                                <FormControl>
                                                    <Input
                                                        placeholder={t('Input Vehicle Brand')}
                                                        {...field}
                                                        onChange={field.onChange}
                                                        maxLength={100}
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
                                                <FormLabel>{t('Vehicle Series')}</FormLabel>
                                                <Required/>
                                                <FormMessage />
                                                <FormControl>
                                                    <Input
                                                        placeholder={t('Input Vehicle Series')}
                                                        {...field}
                                                        onChange={field.onChange}
                                                        maxLength={100}
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
                                                <FormLabel>{t('Vehicle Model')}</FormLabel>
                                                <Required/>
                                                <FormMessage />
                                                <FormControl>
                                                    <Input
                                                        placeholder={t('Input Vehicle Model')}
                                                        {...field}
                                                        onChange={field.onChange}
                                                        maxLength={100}
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
                                            <FormLabel className='mr-4 align-middle'>{t('With Driver?')}</FormLabel>
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
                                                <FormLabel>{t('Street Address')}</FormLabel>
                                                <Required/>
                                                <FormMessage />
                                                <FormControl className='w-full'>
                                                    <Input
                                                        placeholder={t('Street Address')}
                                                        {...field}
                                                        onChange={field.onChange}
                                                        maxLength={100}
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
                                                        placeholder={t('QTY')}
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
                                                        maxLength={50}
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
                                                    maxLength={1000}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <div className="justify-center flex">
                                    <Button type="submit" className='mt-4'>{t('Edit Vehicle Product')}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    )}
            </div>
        </div>

    )
}

export default EditVehicle

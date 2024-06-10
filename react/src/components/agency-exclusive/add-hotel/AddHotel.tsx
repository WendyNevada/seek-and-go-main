import { ChangeEvent, useState } from 'react'
import { addHotelSchema, handleImageUpload } from './utils/schema'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ProvinceCombobox } from '../add-attraction/ComboBox.tsx/ProvinceComboBox'
import { CityCombobox } from '../add-attraction/ComboBox.tsx/cityComboBox/CityCombobox'
import { KecamatanCombobox } from '../add-attraction/ComboBox.tsx/kecamatanCombobox/KecamatanCombobox'
import { KelurahanCombobox } from '../add-attraction/ComboBox.tsx/kelurahanCombobox/KelurahanCombobox'
import { useLogin } from '@/context/LoginContext'
import axiosClient from '@/axios.client'
import { toast } from '@/components/ui/use-toast'
import axios, { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { Required } from '@/components/ui/Custom/required'
import { useTranslation } from 'react-i18next'

const AddHotel = () => {
    const { t } = useTranslation();
    const [imageUrl, setImageUrl] = useState<string|undefined>('');
    const { user } = useLogin();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof addHotelSchema>>({
        resolver: zodResolver(addHotelSchema),
        defaultValues: {
            hotel_code: "",
            hotel_name : "",
            picture: undefined,
            description: "",
            area_1: "",
            area_2: "",
            area_3: "",
            area_4: "",
            address: "",
            rating: 0,
            qty: 0,
            promo_code: "",
            base_price: 0
        }
    })

    const fileRef = form.register("picture");

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        handleImageUpload(event, setImageUrl);
    };

    const handleProvinceSelect = (province:string) => {
        form.setValue("area_1",province);
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

    const onSubmit = async (values: z.infer<typeof addHotelSchema>) => {
        const formData = new FormData();
        formData.append('agency_id', String(user?.agency_id));
        formData.append('hotel_code', values.hotel_code);
        formData.append('hotel_name', values.hotel_name);
        formData.append('description', values.description);
        formData.append('area_1', values.area_1);
        formData.append('area_2', values.area_2);
        formData.append('area_3', values.area_3);
        formData.append('area_4', values.area_4);
        formData.append('address', values.address);
        formData.append('rating', '0');
        formData.append('qty', values.qty.toString());
        formData.append('promo_code', values.promo_code !== null && values.promo_code !== undefined ? String(values.promo_code) : 'null');
        formData.append('base_price', values.base_price.toString());

        formData.append('picture', values.picture[0]);

        try{
            await axiosClient.post('/v1/AddHotel', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Set the content type to multipart/form-data
                }
            });
            toast({
                variant: "success",
                description: "Item added."
            });
            navigate('/Agency/Product');
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
                        <h1 className="text-2xl font-bold mb-8 text-center">{t('Add Hotel')}</h1>

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
                                                maxLength={7} //Add Felix
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
                                                maxLength={100}
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

                        <div className="flex flex-row">
                                <FormField
                                    control={form.control}
                                    name="area_1"
                                    render={() => (
                                        <FormItem className="custom-field mt-4 mr-8 flex flex-col">
                                            <FormLabel>{t('Province')} <Required/></FormLabel>
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
                                            <FormLabel>{t('City')}<Required/></FormLabel>
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
                                        <FormLabel>{t('District')}<Required/></FormLabel>
                                        <FormMessage />
                                        <FormControl>
                                            <KecamatanCombobox onSelectKecamatan={handleKecamatanSelect} selectedCity={form.watch("area_2")} selectedProvince={form.watch("area_1")}/>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="area_4"
                                render={() => (
                                    <FormItem className="custom-field mt-4 flex flex-col">
                                        <FormLabel>{t('Subdistrict')}<Required/></FormLabel>
                                        <FormMessage />
                                        <FormControl>
                                            <KelurahanCombobox onSelectKelurahan={handleKelurahanSelect} selectedKecamatan={form.watch("area_3")} selectedCity={form.watch("area_2")} selectedProvince={form.watch("area_1")}/>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

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

                        <div className="justify-center flex">
                            <Button type="submit" className='mt-6'>{t('Add Hotel Product')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default AddHotel

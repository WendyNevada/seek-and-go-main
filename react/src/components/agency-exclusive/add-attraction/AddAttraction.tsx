import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import React, { useState, ChangeEvent } from 'react'
import { z } from 'zod'
import { addAttractionSchema } from './utils/schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { ProvinceCombobox } from './ComboBox.tsx/ProvinceComboBox'
import { CityCombobox } from './ComboBox.tsx/cityComboBox/CityCombobox'
import { KecamatanCombobox } from './ComboBox.tsx/kecamatanCombobox/KecamatanCombobox'
import { KelurahanCombobox } from './ComboBox.tsx/kelurahanCombobox/KelurahanCombobox'
import { Textarea } from '@/components/ui/textarea'
import axiosClient from '@/axios.client'
import { toast } from '@/components/ui/use-toast'
import axios, { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { useLogin } from '@/context/LoginContext'
import { Required } from '@/components/ui/Custom/required'
import { useTranslation } from 'react-i18next'

const AddAttraction = () => {
    const { t } = useTranslation();
    //const attractionObj:AttractionObj = new AttractionObj();
    const [imageUrl, setImageUrl] = useState('');
    const navigate = useNavigate();
    const { user } = useLogin();

    const form = useForm<z.infer<typeof addAttractionSchema>>({
        resolver: zodResolver(addAttractionSchema),
        defaultValues: {
            attraction_code: "",
            picture: undefined,
            area_1: "",
            area_2: "",
            area_3: "",
            area_4: "",
            attraction_name: "",
            description: "",
            address: "",
            is_active: true,
            qty: 0,
            promo_code: "",
            base_price: 0,
            promo_code_affiliate: ""
        }
    })

    const fileRef = form.register("picture");

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

    const onSubmit = async (values: z.infer<typeof addAttractionSchema>) => {

        const formData = new FormData();
        formData.append('agency_id', String(user?.agency_id)); // Assuming agency_id is a string
        formData.append('attraction_code', values.attraction_code);
        formData.append('area_1', values.area_1);
        formData.append('area_2', values.area_2);
        formData.append('area_3', values.area_3);
        formData.append('area_4', values.area_4);
        formData.append('attraction_name', values.attraction_name);
        formData.append('description', values.description);
        formData.append('address', values.address);
        formData.append('rating', '0'); // Assuming rating is a string or number
        formData.append('is_active', '1'); // Convert boolean to string
        formData.append('qty', values.qty.toString()); // Convert number to string
        formData.append('promo_code', values.promo_code !== null && values.promo_code !== undefined ? String(values.promo_code) : 'null');
        formData.append('base_price', values.base_price.toString()); // Convert number to string
        formData.append('promo_code_affiliate', values.promo_code_affiliate);

        // Append the picture file
        formData.append('picture', values.picture[0]); // Assuming values.picture is a FileList

        try{
            await axiosClient.post('/v1/AddAttraction', formData, {
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
                <div className="mx-auto max-w-xl px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <h1 className="text-2xl font-bold mb-8 text-center">{t('Add Attraction')}</h1>
                            <FormField
                                control={form.control}
                                name="attraction_code"
                                render={({ field }) => (
                                    <FormItem className="custom-field">
                                        <FormLabel>{t('Attraction Code')}</FormLabel>
                                        <Required/>
                                        <FormMessage />
                                        <FormControl>
                                            <Input
                                                placeholder={t('Attraction Code')}
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
                                name="picture"
                                render={() => (
                                    <FormItem className="custom-field">
                                        <FormLabel>{t('Picture')}</FormLabel>
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
                                            <FormLabel>{t('Province')}<Required/></FormLabel>
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
                                name="attraction_name"
                                render={({ field }) => (
                                    <FormItem className="custom-field">
                                        <FormLabel>{t('Attraction Name')}<Required/></FormLabel>
                                        <FormMessage />
                                        <FormControl>
                                            <Input
                                                placeholder={t('Attraction Name')}
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
                                        <FormLabel>{t('Description')}<Required/></FormLabel>
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
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem className="custom-field">
                                        <FormLabel>{t('Street Address')}<Required/></FormLabel>
                                        <FormMessage />
                                        <FormControl>
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
                                        <FormLabel>{t('QTY')}<Required/></FormLabel>
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
                                        <FormLabel>{t('Promo Code')}</FormLabel>
                                        <FormMessage />
                                        <FormControl>
                                            <Input
                                                placeholder={t('Promo Code')}
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
                                        <FormLabel>{t('Price')}<Required/></FormLabel>
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
                                <Button type="submit" className='mt-4'>{t('Add Attraction Product')}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
        </div>
    )
}

export default AddAttraction

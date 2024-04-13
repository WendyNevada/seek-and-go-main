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
import { Switch } from '@/components/ui/switch'
import axiosClient from '@/axios.client'
import AttractionObj from './utils/model'

const AddProduct = () => {
    const attractionObj:AttractionObj = new AttractionObj();
    const [imageUrl, setImageUrl] = useState('');

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

        // const response = await axiosClient.post('/v1/GetRefZipcodeIdByArea4AndArea3', {area_3: values.area_3, area_4: values.area_4})
        // console.log("hasil generate api ", response.data.ref_zipcode_id);

        attractionObj.agency_id = 1;//nanti diganti dan diganti ambil dari context
        attractionObj.attraction_code = values.attraction_code;
        attractionObj.area_1 = values.area_1;
        attractionObj.area_2 = values.area_2;
        attractionObj.area_3 = values.area_3;
        attractionObj.area_4 = values.area_4;
        attractionObj.attraction_name = values.attraction_name;
        attractionObj.description = values.description;
        attractionObj.address = values.address;
        attractionObj.rating = 0;
        attractionObj.is_active = values.is_active;
        attractionObj.qty = values.qty;
        attractionObj.promo_code = values.promo_code;
        attractionObj.base_price = values.base_price;
        attractionObj.promo_code_affiliate = values.promo_code_affiliate;
        attractionObj.picture = values.picture[0];

        console.log("object to backend",attractionObj);

        axiosClient.post('/v1/AddAttraction', {attractionObj})

        try{
            console.log(values);
        }catch(error){
            console.log(error);
        }
    }

    return (
        <div className="min-h-50 w-50 p-0 sm:p-12">
                <div className="mx-auto max-w-xl px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <h1 className="text-2xl font-bold mb-8 text-center">Add Attraction</h1>

                            <FormField
                                control={form.control}
                                name="attraction_code"
                                render={({ field }) => (
                                    <FormItem className="custom-field">
                                        <FormLabel>{"Attraction Code"}</FormLabel>
                                        <FormMessage />
                                        <FormControl>
                                            <Input
                                                placeholder={"Attraction Code"}
                                                {...field}
                                                onChange={field.onChange}
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
                                                // onChange = { (event) =>
                                                //     field.onChange(event.target?.files?.[0] ?? undefined)
                                                // }
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
                                            <FormLabel>{"Province"}</FormLabel>
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
                                            <FormLabel>{"City"}</FormLabel>
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
                                            <FormLabel>{"District"}</FormLabel>
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
                                            <FormLabel>{"Subdistrict"}</FormLabel>
                                            <FormMessage />
                                            <FormControl>
                                                <KelurahanCombobox onSelectKelurahan={handleKelurahanSelect} selectedKecamatan={form.watch("area_3")}/>
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
                                        <FormLabel>{"Attraction Name"}</FormLabel>
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
                                        <FormLabel>{"Address"}</FormLabel>
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
                                name="is_active"
                                render={({ field }) => (
                                    <FormItem className="custom-field mt-2">
                                        <FormLabel className='mr-4 align-middle'>{"Is Active"}</FormLabel>
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
                            <FormField
                                control={form.control}
                                name="qty"
                                render={({ field }) => (
                                    <FormItem className="custom-field">
                                        <FormLabel>{"QTY"}</FormLabel>
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
                                <Button type="submit" className='mt-4'>Add Attraction Product</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
    )
}

export default AddProduct

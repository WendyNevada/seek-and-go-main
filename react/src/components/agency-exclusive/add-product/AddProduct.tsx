import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import React, { useState } from 'react'
import { z } from 'zod'
import { addAttractionSchema } from './utils/schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { ProvinceCombobox } from './ComboBox.tsx/ProvinceComboBox'
import { CityCombobox } from './ComboBox.tsx/CityCombobox'
import { KecamatanCombobox } from './ComboBox.tsx/KecamatanCombobox'
import { KelurahanCombobox } from './ComboBox.tsx/KelurahanCombobox'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

const AddProduct = () => {
    const form = useForm<z.infer<typeof addAttractionSchema>>({
        resolver: zodResolver(addAttractionSchema),
        defaultValues: {
            attraction_code: "",
            picture: undefined,
            area_1: "",
            // area_2: "",
            // area_3: "",
            // area_4: "",
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
        console.log("ini provinsi" + province);
    };

    const onSubmit = (values: z.infer<typeof addAttractionSchema>) => {
        console.log(values.area_1)
        console.log(values);
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
                                render={({ field }) => (
                                    <FormItem className="custom-field">
                                        <FormLabel>{"Picture"}</FormLabel>
                                        <FormMessage />
                                        <FormControl>
                                            <Input
                                                id="picture"
                                                type="file"
                                                accept='.jpg, .jpeg, .png'
                                                {...fileRef}
                                                // onChange = { (event) =>
                                                //     field.onChange(event.target?.files?.[0] ?? undefined)
                                                // }
                                            />
                                        </FormControl>
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
                                {/* <FormField
                                    control={form.control}
                                    name="area_2"
                                    render={({ field }) => (
                                        <FormItem className="custom-field mt-4 flex flex-col">
                                            <FormLabel>{"City"}</FormLabel>
                                            <FormMessage />
                                            <FormControl>
                                                <CityCombobox/>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                /> */}
                            </div>

                            {/* <div className="flex flex-row">
                                <FormField
                                    control={form.control}
                                    name="area_3"
                                    render={({ field }) => (
                                        <FormItem className="custom-field mt-4 mr-8 flex flex-col">
                                            <FormLabel>{"District"}</FormLabel>
                                            <FormMessage />
                                            <FormControl>
                                                <KecamatanCombobox/>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="area_4"
                                    render={({ field }) => (
                                        <FormItem className="custom-field mt-4 flex flex-col">
                                            <FormLabel>{"Subdistrict"}</FormLabel>
                                            <FormMessage />
                                            <FormControl>
                                                <KelurahanCombobox/>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div> */}

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

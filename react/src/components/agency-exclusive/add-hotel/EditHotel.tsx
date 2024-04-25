import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import React, { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { editHotelSchema, handleImageUpload } from './utils/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const EditHotel = ({ref_hotel_id} : {ref_hotel_id: number}) => {
    const [imageUrl, setImageUrl] = useState<string|undefined>('');

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

    const onSubmit = async(value: z.infer<typeof editHotelSchema>) => {
        console.log(value)
    }

    return (
        <div className="min-h-50 w-50 p-0 sm:p-12">
            <div className="mx-auto max-w-2xl px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl">
                {ref_hotel_id}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <h1 className="text-2xl font-bold mb-8 text-center">Edit Hotel</h1>

                        <div className="flex flex-row space-x-4">
                            <FormField
                                control={form.control}
                                name="hotel_code"
                                render={({ field }) => (
                                    <FormItem className="custom-field">
                                        <FormLabel>{"Hotel Code"}</FormLabel>
                                        <FormMessage />
                                        <FormControl className='w-full'>
                                            <Input
                                                placeholder={"Hotel Code"}
                                                {...field}
                                                onChange={field.onChange}
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
                                        <FormLabel>{"Hotel Name"}</FormLabel>
                                        <FormMessage />
                                        <FormControl className='w-full'>
                                            <Input
                                                placeholder={"Hotel Name"}
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
                                    <FormLabel>{"Picture"}</FormLabel>
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
                        <div className="flex flex-row space-x-4">
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem className="custom-field">
                                        <FormLabel>{"Address"}</FormLabel>
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
                                        <FormLabel>{"QTY"}</FormLabel>
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
                                        <FormLabel>{"Promo Code"}</FormLabel>
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
                                    <FormLabel>{"Base Price (perhari)"}</FormLabel>
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
                            <Button type="submit" className='mt-4'>Edit Hotel Product
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default EditHotel

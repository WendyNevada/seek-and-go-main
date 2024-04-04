import { Button } from '@/components/ui/button'
import React from 'react'
import { useForm } from 'react-hook-form'
import { customerLoginSchema } from '../utils/schema'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const CustomerLogin = () => {

    const form = useForm<z.infer<typeof customerLoginSchema>>({
        resolver: zodResolver(customerLoginSchema),
        defaultValues: {
            email : "",
            password : "",
        },
    });

    const onSubmit = (values: z.infer<typeof customerLoginSchema>) => {
        console.log(values)
    };

    return (
        <div className="min-h-50 w-50 p-0 sm:p-12">
            <div className="mx-auto max-w-xl px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <h1 className="text-2xl font-bold mb-8 text-center">Customer Login</h1>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="custom-field">
                                    <FormLabel>{"Customer Name"}</FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <Input
                                            type='email'
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
                            name="password"
                            render={({ field }) => (
                                <FormItem className="custom-field mt-4">
                                    <FormLabel>{"Password"}</FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder={field.name}
                                            {...field}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className="justify-center flex">
                            <Button type="submit" className='mt-4'>Login</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default CustomerLogin

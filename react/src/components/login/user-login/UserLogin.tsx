import { Button } from '@/components/ui/button'
import React from 'react'
import { useForm } from 'react-hook-form'
import { loginSchema } from '../utils/schema'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useLogin } from '@/context/LoginContext'

const UserLogin = () => {
    //const userLogin:UserLogin = new UserLogin();
    const { login } = useLogin();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email : "",
            password : "",
        },
    });

    const onSubmit = async (values: z.infer<typeof loginSchema>) => {
        try {
            await login(values); // Call the login function from the context
        } catch (error) {
            console.log(error);
        }
    };
    // const onSubmit = (values: z.infer<typeof loginSchema>) => {
    //     console.log(values)

    //     axiosClient.post('/v1/Login', values)
    //     .then(response => {
    //         console.log(response.data)
    //         userLogin.account_id = response.data.account_id,
    //         userLogin.role = response.data.role,
    //         console.log(userLogin)
    //         localStorage.setItem('token', response.data.token);
    //     }).catch(error => {
    //         console.log(error);
    //     });
    // };

    return (
        <div className="min-h-50 w-50 p-0 sm:p-12">
            <div className="mx-auto max-w-xl px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <h1 className="text-2xl font-bold mb-8 text-center">Login</h1>
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

export default UserLogin

"use client"
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema } from '../utils/schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import axiosClient from '@/axios.client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';

const CustomerRegisterComponent = () => {
    const navigate = useNavigate();
    // const {setUser, setToken} = useStateContext()
    // const [errors, setErrors] = useState(null)

    const form = useForm<z.infer<typeof customerSchema>>({
        resolver: zodResolver(customerSchema),
        defaultValues: {
        customer_name: "",
        account_name: "",
        email: "",
        phone: "",
        birth_date: new Date(),
        gender: "",
        password: "",
        //confirmPassword: "",
        role:"Customer"
        },
    });

    function formatDate(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    const onSubmit = (values: z.infer<typeof customerSchema>) => {
        values.birth_date = formatDate(values.birth_date);
        console.log(values.birth_date);

        values.customer_name = "tes1";
        values.role="Customer";
        console.log(values);

        try{
            axiosClient.post('/v1/CreateAccountCustomer', values);
            toast({
                variant: "success",
                description: "Register Success."
            });
            navigate('/Login');
        }catch (response) {
            const axiosError = response as AxiosError; // Cast the error to AxiosError
            if (axios.isAxiosError(response)) { // Check if the error is an AxiosError
                toast({
                    variant: "destructive",
                    description: (axiosError.response?.data as { message: string })?.message,
                });
            }
        }
    //   .then(({data}) => {
    //     setUser(data.user)
    //     setToken(data.token);
    //   })
    //   .catch(err => {
    //     const response = err.response;
    //     if (response && response.status === 422) {
    //       setErrors(response.data.errors)
    //     }
    //   })
    };

    return (
        <div className="min-h-50 w-50 p-0 sm:p-12">
            <div className="mx-auto max-w-xl px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <h1 className="text-2xl font-bold mb-8 text-center">Customer Register</h1>
                        <FormField
                            control={form.control}
                            name="customer_name"
                            render={({ field }) => (
                                <FormItem className="custom-field">
                                    <FormLabel>{"Customer Name"}</FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <Input
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
                            name="account_name"
                            render={({ field }) => (
                                <FormItem className="custom-field mt-4">
                                    <FormLabel>{"Account Name"}</FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <Input
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
                            name="email"
                            render={({ field }) => (
                                <FormItem className="custom-field mt-4">
                                    <FormLabel>{"Email"}</FormLabel>
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
                            name="phone"
                            render={({ field }) => (
                                <FormItem className="custom-field mt-4">
                                    <FormLabel>{"Phone"}</FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <Input
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
                            name="birth_date"
                            render={({ field }) => (
                                <FormItem className="custom-field mt-4">
                                    <FormLabel className='mr-4'>{"Tanggal Lahir"}</FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[300px] justify-start text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                                >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem className="custom-field mt-4">
                                    <FormLabel>{"Gender"}</FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <RadioGroup className='flex flex-row' defaultValue="option-one" onChange={newValue => field.onChange(newValue)}>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="M" id="option-one"/>
                                                <Label htmlFor="option-one">Male</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="F" id="option-two"/>
                                                <Label htmlFor="option-two">Female</Label>
                                            </div>
                                        </RadioGroup>
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
                                            type="password"
                                            placeholder={field.name}
                                            {...field}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className="justify-center flex">
                            <Button type="submit" className='mt-4'>Register</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default CustomerRegisterComponent


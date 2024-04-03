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
import { DatePickerDemo } from '@/components/ui/datepicker';
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CustomerRegisterItems } from '../api';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const CustomerRegisterComponent = () => {

    const form = useForm<z.infer<typeof customerSchema>>({
        resolver: zodResolver(customerSchema),
        defaultValues: {
        name: "",
        email: "",
        phone: "",
        dob: new Date(),
        gender: "",
        password: "",
        confirmPassword: ""
        },
    });

    const onSubmit = (values: z.infer<typeof customerSchema>) => {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        values.dob = new Date(values.dob);
        console.log(values);
    };

    return (
        <div className="min-h-screen w-full bg-gray-100 p-0 sm:p-12">
            <div className="mx-auto max-w-xl px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <h1 className="text-2xl font-bold mb-8 text-center">Customer Login</h1>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="custom-field">
                                    <FormLabel>{"Name"}</FormLabel>
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
                            name="dob"
                            render={({ field }) => (
                                <FormItem className="custom-field mt-4">
                                    <FormLabel className='mr-4'>{"tanggal lahir"}</FormLabel>
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
                                        <RadioGroup defaultValue="option-one" onChange={newValue => field.onChange(newValue)}>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="male" id="option-one"/>
                                                <Label htmlFor="option-one">Male</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="female" id="option-two"/>
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
                        {/* <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" required type="password" />
                        </div> */}
                        <Button type="submit" className='mt-4'>Register</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default CustomerRegisterComponent


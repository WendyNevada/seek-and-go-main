import React from 'react'
import { customerSchema } from '../utils/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { date, z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DatePickerDemo } from '@/components/ui/datepicker';
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

const CustomerRegister = () => {
    const form = useForm<z.infer<typeof customerSchema>>({
        resolver: zodResolver(customerSchema),
        defaultValues: {
        name: "",
        email: "",
        phone: "",
        dob: undefined,
        gender: "",
        password: "",
        confirmPassword: ""
        },
    });

    const onSubmitConfirm = (values: z.infer<typeof customerSchema>) => {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        values.dob = new Date(values.dob);
        console.log(values);
    };

    // const onSubmit = async (values: z.infer<typeof customerSchema>) => {
    //     //event.preventDefault(); // Prevent default form submission behavior
    //     try {
    //         // Submit the form data or perform any other action
    //         await form.handleSubmit(onSubmitConfirm)();
    //     } catch (error) {
    //         console.error('Form submission error:', error);
    //     }
    // };


    return (
        <div>
            <div className="form-container sign-in">
            <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmitConfirm)}
                        className="space-y-8"
                    >
                        <h1>As Agency</h1>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="custom-field">
                                    <FormLabel>{"Name"}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={field.name}
                                            {...field}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="custom-field">
                                    <FormLabel>{"Email"}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={field.name}
                                            {...field}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem className="custom-field">
                                    <FormLabel>{"Phone"}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={field.name}
                                            {...field}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* <input
                            type="date"
                            placeholder="Tanggal Lahir"
                            {...form.register("dob")} // Register the input field
                            onChange={(e) => form.setValue("dob", new Date(e.target.value))} // Update the form value
                            value={form.watch("dob")?.toISOString().split("T")[0]} // Watch the form value
                        /> */}
                        {/* <DatePickerDemo/> */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-[280px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(dob, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                selected={dob}
                                onSelect={field}
                                initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem className="custom-field">
                                    <FormLabel>{"Gender"}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={field.name}
                                            {...field}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="custom-field">
                                    <FormLabel>{"Password"}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={field.name}
                                            {...field}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem className="custom-field">
                                    <FormLabel>{"Confirm Password"}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={field.name}
                                            {...field}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Register</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default CustomerRegister

import React from "react";
import { useForm } from "react-hook-form";
import { agencySchema } from "../utils/schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import FormInputItem from "@/components/common/FormInputItem";
import { Input } from "@/components/ui/input";

const AgencyRegister = () => {
    const form = useForm<z.infer<typeof agencySchema>>({
        resolver: zodResolver(agencySchema),
        defaultValues: {
            name: "",
            email: "",
            npwp: "",
            location: "",
            password: "",
            confirmPassword: "",
        },
    });
    const onSubmit = (values: z.infer<typeof agencySchema>) => {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
    };

    return (
        <div>
            <div className="form-container sign-up">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="">
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
                                <FormItem className="">
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
                            name="npwp"
                            render={({ field }) => (
                                <FormItem className="">
                                    <FormLabel>{"NPWP"}</FormLabel>
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
                            name="location"
                            render={({ field }) => (
                                <FormItem className="">
                                    <FormLabel>{"Location"}</FormLabel>
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
                                <FormItem className="">
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
                                <FormItem className="">
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
    );
};

export default AgencyRegister;

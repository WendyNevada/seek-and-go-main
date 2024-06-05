import { agencySchema } from '../utils/schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { hitAddApi } from '@/context/HitApi';

const AgencyRegisterComponent = () => {
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof agencySchema>>({
        resolver: zodResolver(agencySchema),
        defaultValues: {
            agency_name: "",
            account_name: "",
            email: "",
            password: "",
            phone: "",
            npwp:"",
            location:"",
            role:"Agency"
        },
    });

    const onSubmit = async (values: z.infer<typeof agencySchema>) => {
        console.log(values);
        const response = await hitAddApi("/v1/CreateAccountAgency",values);
        toast({
            variant: "success",
            description: "Please Check Your Email",
        });
        if(response === 200){
            navigate("/Login");
        }
        // try {
        //     axiosClient.post("/v1/CreateAccountAgency", values);
        //     toast({
        //         variant: "success",
        //         description: "Register Success.",
        //     });
        //     //tambah if response.status = ok
        //     navigate("/Login");
        // } catch (response) {
        //     const axiosError = response as AxiosError; // Cast the error to AxiosError
        //     if (axios.isAxiosError(response)) {
        //         // Check if the error is an AxiosError
        //         toast({
        //             variant: "destructive",
        //             description: (
        //                 axiosError.response?.data as { message: string }
        //             )?.message,
        //         });
        //     }
        // }
    };

    return (
        <div className="min-h-50 w-50 p-0 sm:p-12">
            <div className="mx-auto max-w-xl px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <h1 className="text-2xl font-bold mb-8 text-center">
                            Agency Register
                        </h1>
                        <FormField
                            control={form.control}
                            name="agency_name"
                            render={({ field }) => (
                                <FormItem className="custom-field">
                                    <FormLabel>{"Agency Name"}</FormLabel>
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
                                            type="email"
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
                                            type="password"
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
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem className="custom-field mt-4">
                                    <FormLabel>{"Confirm Password"}</FormLabel>
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
                            name="npwp"
                            render={({ field }) => (
                                <FormItem className="custom-field mt-4">
                                    <FormLabel>{"NPWP"}</FormLabel>
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
                            name="location"
                            render={({ field }) => (
                                <FormItem className="custom-field mt-4">
                                    <FormLabel>{"Location"}</FormLabel>
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
                        <div className="justify-center flex">
                            <Button type="submit" className="mt-4">
                                Register
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default AgencyRegisterComponent;

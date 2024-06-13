import { agencySchema } from "../utils/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { hitAddApi } from "@/context/HitApi";
import { toast } from "@/components/ui/use-toast";

const AgencyRegisterComponent = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [ loading, setLoading ] = useState(false);

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
        setLoading(true);
        const response = await hitAddApi("/v1/CreateAccountAgency",values);

        if(response === 200){
            toast({
                variant: "success",
                description: "Please Check Your Email",
            });

            navigate("/Login");
        }
        setLoading(false);
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

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            form.setValue("phone", value);
        }
    };

    return (
        <div className="min-h-50 w-50 p-0 sm:p-12">
            <div className="mx-auto max-w-xl px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <h1 className="text-2xl font-bold mb-8 text-center">
                            {t('Agency Register')}
                        </h1>
                        <FormField
                            control={form.control}
                            name="agency_name"
                            render={({ field }) => (
                                <FormItem className="custom-field">
                                    <FormLabel>{t('Agency Name')} <Required/></FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <Input
                                            placeholder={t('Agency Name')}
                                            {...field}
                                            onChange={field.onChange}
                                            maxLength={100}
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
                                    <FormLabel>{t('Account Name')}<Required/></FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <Input
                                            placeholder={t('Account Name')}
                                            {...field}
                                            onChange={field.onChange}
                                            maxLength={100}
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
                                    <FormLabel>{t('Email')}<Required/></FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder={t('Email')}
                                            {...field}
                                            onChange={field.onChange}
                                            maxLength={100}
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
                                    <FormLabel>{t('Password')}<Required/></FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder={t('Password')}
                                            {...field}
                                            onChange={field.onChange}
                                            maxLength={100}
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
                                    <FormLabel>{t('Phone Number')}<Required/></FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <Input
                                            type="tel"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            placeholder={t('Phone Number')}
                                            {...field}
                                            // onChange={field.onChange}
                                            onChange={handlePhoneChange}
                                            maxLength={20}
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
                                    <FormLabel>{t('NPWP')} {t('(can be -)')}<Required/></FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <Input
                                            placeholder={t('NPWP')}
                                            {...field}
                                            onChange={field.onChange}
                                            maxLength={50}
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
                                    <FormLabel>{t('Location')}<Required/></FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <Input
                                            placeholder={t('Location')}
                                            {...field}
                                            onChange={field.onChange}
                                            maxLength={100}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className="justify-center flex">
                            <Button type="submit" className='mt-4' disabled={loading} variant="primary">
                                {loading ? (
                                    <HashLoader size={20} color={"#ffffff"} loading={loading} />
                                ) : (
                                    t('Register')
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default AgencyRegisterComponent;

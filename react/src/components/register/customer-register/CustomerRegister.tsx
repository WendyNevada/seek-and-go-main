"use client"
import { useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema } from '../utils/schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { format } from "date-fns"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Required } from '@/components/ui/Custom/required';
import { hitAddApi } from '@/context/HitApi';
import { useTranslation } from 'react-i18next';

const CustomerRegisterComponent = () => {
    const { t } = useTranslation();

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

    const onSubmit = async (values: z.infer<typeof customerSchema>) => {
        values.birth_date = formatDate(values.birth_date);

        values.customer_name = "tes1";
        values.role="Customer";

        const response = await hitAddApi("/v1/CreateAccountCustomer",values);
        toast({
            variant: "success",
            description: "Please Check Your Email",
        });
        if(response === 200){
            navigate("/Login");
        }
    };

    return (
        <div className="min-h-50 w-50 p-0 sm:p-12">
            <div className="mx-auto max-w-xl px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <h1 className="text-2xl font-bold mb-8 text-center">{t('Customer Register')}</h1>
                        <FormField
                            control={form.control}
                            name="customer_name"
                            render={({ field }) => (
                                <FormItem className="custom-field">
                                    <FormLabel>{t('Customer Name')}<Required/></FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <Input
                                            placeholder={t('Customer Name')}
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
                                    <FormLabel>{t('Account Name')}<Required/></FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <Input
                                            placeholder={t('Account Name')}
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
                                    <FormLabel>{t('Email')}<Required/></FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <Input
                                            type='email'
                                            placeholder={t('Email')}
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
                                            placeholder={t('Phone Number')}
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
                                    <FormLabel className='mr-4'>{t("Birth Date")}<Required/></FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <input
                                            type="date"
                                            className="w-[300px] justify-start text-left font-normal bg-slate-100"
                                            value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                                            onChange={e => field.onChange(new Date(e.target.value))}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem className="custom-field mt-4">
                                    <FormLabel>{t('Gender')}<Required/></FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <RadioGroup className='flex flex-row' defaultValue="option-one" onChange={newValue => field.onChange(newValue)}>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="M" id="option-one"/>
                                                <Label htmlFor="option-one">{t('Male')}</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="F" id="option-two"/>
                                                <Label htmlFor="option-two">{t('Female')}</Label>
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
                                    <FormLabel>{t('Password')}<Required/></FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder={t('Password')}
                                            {...field}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className="justify-center flex">
                            <Button type="submit" className='mt-4'>{t('Register')}</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default CustomerRegisterComponent


import React, { useEffect } from 'react'
import { Account } from '../interface/interface'
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { hitAddApi } from '@/context/HitApi';
import { useLogin } from '@/context/LoginContext';

const EditCustomerProfileForm = ({customer} : {customer : Account}) => {
    
    const { t } = useTranslation();
    const { user } = useLogin();

    const form = useForm<Account>({
        defaultValues:{
            account_name: '',
            phone: '',
            customers: {
                customer_name: '',
                gender: '',
                birth_date: ''
            }
        }
    });

    useEffect(() => {
        form.setValue('account_name', customer.account_name);
        form.setValue('phone', customer.phone);
        form.setValue('customers', customer.customers);
    }, [])

    const onSubmit = async (values: Account) => {
        const merged_values = {...values, account_id: user?.account_id};
        const response = await hitAddApi("/v1/UpdateCustomerAccount", merged_values);
        if(response === 200)
        {
            window.location.reload();
        }
    }

  return (
    <div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className=" bg-white border-0 shadow-lg sm:rounded-3xl p-12 space-y-2">
                    <div className="flex flex-row space-x-4">
                        <FormField
                            control={form.control}
                            name="account_name"
                            render={({ field }) => (
                                <FormItem className="custom-field">
                                    <FormLabel>{t('Account Name')}</FormLabel>
                                    <FormMessage />
                                    <FormControl className='w-full'>
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
                            name="phone"
                            render={({ field }) => (
                                <FormItem className="custom-field">
                                    <FormLabel>{t('Phone Number')}</FormLabel>
                                    <FormMessage />
                                    <FormControl className='w-full'>
                                        <Input
                                            placeholder={t('Phone')}
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
                        name="customers.customer_name"
                        render={({ field }) => (
                            <FormItem className="custom-field">
                                <FormLabel>{t('Customer Name')}</FormLabel>
                                <FormMessage />
                                <FormControl className='w-full'>
                                    <Input
                                        placeholder={t('Customer Name')}
                                        {...field}
                                        onChange={field.onChange}
                                        disabled
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="customers.gender"
                        render={({ field }) => (
                            <FormItem className="custom-field">
                                <FormLabel>{t('Gender')}</FormLabel>
                                <FormMessage />
                                <FormControl className='w-full'>
                                    <Input
                                        placeholder={t('Gender')}
                                        {...field}
                                        onChange={field.onChange}
                                        disabled
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="customers.birth_date"
                        render={({ field }) => (
                            <FormItem className="custom-field">
                                <FormLabel>{t('Birth Date')}</FormLabel>
                                <FormMessage />
                                <FormControl className='w-full'>
                                    <Input
                                        placeholder={t('Birth Date')}
                                        {...field}
                                        onChange={field.onChange}
                                        disabled
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className="justify-center flex space-x-2">
                        <Button type="submit" className='mt-4 bg-green-500'>{t('Confirm')}
                        </Button>
                        <Button type="button" variant='destructive' className='mt-4'>{t('Cancel')}</Button>
                    </div>
                </div>
            </form>
        </Form>
    </div>
  )
}

export default EditCustomerProfileForm
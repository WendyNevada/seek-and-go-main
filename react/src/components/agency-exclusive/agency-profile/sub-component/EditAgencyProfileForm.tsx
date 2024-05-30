import { useEffect } from 'react'
import { Account } from '../interface/interface';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const EditAgencyProfileForm = ({agency} : {agency : Account}) => {
    const { t } = useTranslation();

    const form = useForm<Account>({
        defaultValues:{
            account_name: '',
            //password: '',
            phone: '',
            agencies: {
                agency_name: '',
                npwp: '',
                location: '',
            },
        }
    });

    useEffect(() => {
        form.setValue('account_name', agency.account_name);
        form.setValue('phone', agency.phone);
        form.setValue('agencies', agency.agencies);
    }, [])

    const onSubmit = async (values: Account) => {
        console.log(values);
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
                                        <FormLabel>{t('Phone')}</FormLabel>
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
                            name="agencies.agency_name"
                            render={({ field }) => (
                                <FormItem className="custom-field">
                                    <FormLabel>{t('Agency Name')}</FormLabel>
                                    <FormMessage />
                                    <FormControl className='w-full'>
                                        <Input
                                            placeholder={t('Agency Name')}
                                            {...field}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="agencies.npwp"
                            render={({ field }) => (
                                <FormItem className="custom-field">
                                    <FormLabel>{t('NPWP')}</FormLabel>
                                    <FormMessage />
                                    <FormControl className='w-full'>
                                        <Input
                                            placeholder={t('NPWP')}
                                            {...field}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="agencies.location"
                            render={({ field }) => (
                                <FormItem className="custom-field">
                                    <FormLabel>{t('Location')}</FormLabel>
                                    <FormMessage />
                                    <FormControl className='w-full'>
                                        <Input
                                            placeholder={t('Location')}
                                            {...field}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className="justify-center flex space-x-2">
                            <Button type="submit" className='mt-4 bg-blue-500'>{t('Save')}
                            </Button>
                            <Button type="button" variant='destructive' className='mt-4'>{t('Cancel')}</Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default EditAgencyProfileForm

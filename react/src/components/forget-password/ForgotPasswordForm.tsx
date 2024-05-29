import { forgotPassword } from './utils/schema'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Required } from '../ui/Custom/required'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { hitAddApi } from '@/context/HitApi'
import { useForm } from 'react-hook-form'

const ForgotPasswordForm = ({account_id} : {account_id: number}) => {

    const { t } = useTranslation();
    const navigate = useNavigate();

    const form = useForm<forgotPassword>({
        defaultValues: {
            password: "",
            confirm_password: ""
        }
    })

    const onSubmit = async (values: forgotPassword) => {
        const merged_values = {...values, account_id};
        const response = await hitAddApi("/v1/ResetPassword",merged_values);
        if(response === 200)
        {
            navigate('/Login');
        }
}

  return (
    <div className="min-h-50 w-50 p-0 sm:p-12">
        <div className="mx-auto max-w-xl px-24 py-12 bg-white border-0 shadow-lg sm:rounded-3xl">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <h1 className="text-2xl font-bold mb-8 text-center">{t('Reset Password')}</h1>
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="custom-field w-72">
                                <FormLabel>{t('Password')}</FormLabel>
                                <Required/>
                                <FormMessage />
                                <FormControl>
                                    <Input
                                        placeholder={t('Password')}
                                        {...field}
                                        onChange={field.onChange}
                                        type='password'
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirm_password"
                        render={({ field }) => (
                            <FormItem className="custom-field">
                                <FormLabel>{t('Confirm Password')}<Required/></FormLabel>
                                <FormMessage />
                                <FormControl>
                                    <Input
                                        placeholder={t('Confirm Password')}
                                        {...field}
                                        onChange={field.onChange}
                                        type='password'
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className="justify-center flex">
                        <Button type="submit" className='mt-4'>{t('Confirm')}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    </div>
  )
}

export default ForgotPasswordForm

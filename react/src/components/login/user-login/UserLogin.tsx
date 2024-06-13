import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { loginSchema } from '../utils/schema'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useLogin } from '@/context/LoginContext'
import { useTranslation } from 'react-i18next'
import EmailModal from '../modal/EmailModal'
import HashLoader from 'react-spinners/HashLoader'

const UserLogin = () => {
    const { t } = useTranslation();
    //const userLogin:UserLogin = new UserLogin();
    const { login } = useLogin();
    // const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ loading, setLoading ] = useState(false);

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email : "",
            password : "",
        },
    });

    const onSubmit = async (values: z.infer<typeof loginSchema>) => {
        try {
            setLoading(true);
            await login(values); // Call the login function from the context
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const forgetPassword = async () => {
        setIsModalOpen(true);
    }

    return (
        <div className="min-h-50 w-50 p-0 sm:p-12">
            <div className="mx-auto max-w-xl px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <h1 className="text-2xl font-bold mb-8 text-center">{t('Login')}</h1>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="custom-field">
                                    <FormLabel>{t('Email')}</FormLabel>
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
                            name="password"
                            render={({ field }) => (
                                <FormItem className="custom-field mt-4">
                                    <FormLabel>{t('Password')}</FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <Input
                                            type='password'
                                            placeholder={t('Password')}
                                            {...field}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <p className='text-center mt-8 hover:cursor-pointer hover:text-blue-600 hover:underline' onClick={() => forgetPassword()}>{t('Forgot password?')}</p>

                        <div className="justify-center flex">
                            <Button type="submit" className='mt-4' disabled={loading} variant="primary">
                                {loading ? (
                                    <HashLoader size={20} color={"#ffffff"} loading={loading} />
                                ) : (
                                    t('Login')
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
            <EmailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    )
}

export default UserLogin

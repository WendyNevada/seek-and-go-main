import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ChangePassword } from "../interface/interface";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { hitAddApi } from "@/context/HitApi";
import { useLogin } from "@/context/LoginContext";

const EditAgencyPassword = () => {

  const { t } = useTranslation();
  const { user } = useLogin();

  const onSubmit = async (values: ChangePassword) => {
    const merged_values = {...values, account_id: user?.account_id};
    const response = await hitAddApi("/v1/ChangePassword", merged_values);
    if(response === 200)
    {
        window.location.reload();
    }
  }

  const form = useForm<ChangePassword>({
    defaultValues:{
        old_password: '',
        password: '',
        confirm_password: ''
    }
  });

  return (
    <div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className=" bg-white border-0 shadow-lg sm:rounded-3xl p-12 space-y-2 flex flex-col items-center">
                    <FormField
                        control={form.control}
                        name="old_password"
                        render={({ field }) => (
                            <FormItem className="custom-field">
                                <FormLabel>{t('Old Password')}</FormLabel>
                                <FormMessage />
                                <FormControl className='w-64'>
                                    <Input
                                        placeholder={t('Old Password')}
                                        {...field}
                                        onChange={field.onChange}
                                        type="password"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="custom-field">
                                <FormLabel>{t('Password')}</FormLabel>
                                <FormMessage />
                                <FormControl className='w-64'>
                                    <Input
                                        placeholder={t('Password')}
                                        {...field}
                                        onChange={field.onChange}
                                        type="password"
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
                                <FormLabel>{t('Confirm Password')}</FormLabel>
                                <FormMessage />
                                <FormControl className='w-64'>
                                    <Input
                                        placeholder={t('Confirm Password')}
                                        {...field}
                                        onChange={field.onChange}
                                        type="password"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className="justify-center flex space-x-2">
                        <Button type="submit" className='mt-4 bg-green-500'>{t('Confirm')}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    </div>
  )
}

export default EditAgencyPassword

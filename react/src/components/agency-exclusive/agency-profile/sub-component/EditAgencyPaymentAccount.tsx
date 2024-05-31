import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { PayAccount } from '../interface/interface';
import { Button } from '@/components/ui/button';

//icon
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const EditAgencyPaymentAccount = ({ payment }: { payment: PayAccount[] }) => {
    const { t } = useTranslation();
    const [paymentRows, setPaymentRows] = useState<PayAccount[]>([]);

    useEffect(() => {
        if (payment && payment.length > 0) {
            setPaymentRows(payment);
        }
    }, [payment]);

    const form = useForm<PayAccount>();

    const addPaymentRow = () => {
        setPaymentRows([
            ...paymentRows,
            {
                agency_payment_id: 0,
                agency_id: 0,
                payment_type: '',
                bank_name: '',
                account_no: '',
                created_at: '',
                updated_at: '',
                image_url: ''
            }
        ]);
    };

    const handleRemoveRow = (index: number) => {
        const updatedRows = [...paymentRows];
        updatedRows.splice(index, 1);
        setPaymentRows(updatedRows);
    };

    const onSubmit = async () => {
        // Combine account_no, bank_name, and payment_type into one object
        const combinedData = paymentRows.map((row) => ({
            account_no: row.account_no,
            bank_name: row.bank_name,
            payment_type: row.payment_type
        }));

        // Handle form submission here, send combinedData to API
        console.log('Combined data: ', combinedData);
    };
    return (
        <div>
            <div className="bg-white border-0 shadow-lg sm:rounded-3xl p-12 space-y-2">

                <div className="space-x-4">
                    <Button onClick={addPaymentRow} className="btn btn-primary mt-4">
                        {t('Add Payment')}
                    </Button>
                    <Button type="submit" className="btn btn-primary mt-4">
                        {t('Submit')}
                    </Button>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                    {paymentRows.map((row, index) => (
                        <div key={index} className="flex flex-row space-x-4 mt-1">
                            <FormField
                                control={form.control}
                                // @ts-expect-error - Template literal is used to dynamically generate the name prop
                                name={`payment_type[${index}].payment_type`}
                                render={({ field }) => (
                                    <FormItem className="custom-field">
                                        <FormLabel>{t('Payment Type')}</FormLabel>
                                        <FormControl className="w-full">
                                            <Input
                                                placeholder={t('Payment Type')}
                                                defaultValue={row.payment_type}
                                                {...field}
                                                //onChange={(e) => handleInputChange(e, 'payment_type', index)}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                // @ts-expect-error - Template literal is used to dynamically generate the name prop
                                name={`account_no[${index}].account_no`}
                                render={({ field }) => (
                                    <FormItem className="custom-field">
                                        <FormLabel>{t('Account No')}</FormLabel>
                                        <FormControl className="w-full">
                                            <Input
                                                placeholder={t('Account No')}
                                                defaultValue={row.account_no}
                                                {...field}
                                                //onChange={(e) => handleInputChange(e, 'account_no', index)}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                // @ts-expect-error - Template literal is used to dynamically generate the name prop
                                name={`bank_name[${index}].bank_name`}
                                render={({ field }) => (
                                    <FormItem className="custom-field">
                                        <FormLabel>{t('Bank Name')}</FormLabel>
                                        <FormControl className="w-full">
                                            <Input
                                                placeholder={t('Bank Name')}
                                                defaultValue={row.bank_name}
                                                {...field}
                                                //onChange={(e) => handleInputChange(e, 'bank_name', index)}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button className='ml-2 mt-8' variant={'destructive'} onClick={() => handleRemoveRow(index)}>
                                {<HighlightOffIcon />}
                            </Button>
                        </div>
                    ))}
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default EditAgencyPaymentAccount;

import axiosClient from "@/axios.client";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
import { useTranslation } from "react-i18next";
import { useState } from "react";
import HashLoader from "react-spinners/HashLoader";

interface OrderGenericAlertProps {
    apiPath: string;
    id: number;
    selectedPaymentType?: string | null;
    selectedBank?: string | null;
}

const OrderGenericAlert = ({ apiPath, id, selectedPaymentType, selectedBank }: OrderGenericAlertProps) => {

    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.post(apiPath, { order_h_id: id});
            // toast({
            //     variant: response.data.status === "ok" ? "success" : "destructive",
            //     description: response.data.message
            // });
            if (response.data.status === "ok") {
                setTimeout(() => {
                    window.location.reload();
                }, 100);
            }
        } catch (error) {
            const errorMessage = axios.isAxiosError(error) && error.response
                ? error.response.data.message
                : "An unexpected error occurred";
            toast({
                variant: "destructive",
                description: errorMessage
            });
        } finally {
            setLoading(false);
        }
    }

  return (
    <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button variant="primary" className="'bg-blue-500 p-2 hover:bg-blue-700 px-4 w-30 mb-3" disabled={!selectedPaymentType || !selectedBank || loading}>
                {loading ? <HashLoader size={20} color={"#ffffff"} loading={loading} /> : t('Confirm Payment')}
            </Button>
            {/* <Button className='bg-blue-500 p-2 hover:bg-blue-700 px-4 w-30 mb-3' disabled={!selectedPaymentType || !selectedBank} >{t('Confirm Payment')}
            </Button> */}
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>
                    {t('Are you sure?')}
                </AlertDialogTitle>
                <AlertDialogDescription>
                    {t('This action cannot be undone. Please make sure that you already send the payment')}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel disabled={loading} className="bg-red-500 text-white hover:bg-red-600">{t('No')}</AlertDialogCancel>
                <AlertDialogAction onClick={handleClick} disabled={loading} className="bg-green-500 text-white hover:bg-green-600">
                    {loading ? <HashLoader size={20} color={"#ffffff"} loading={loading} /> : t('Yes')}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default OrderGenericAlert
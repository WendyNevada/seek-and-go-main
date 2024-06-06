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

interface CancelOrderAlertProps {
    apiPath: string;
    id: number;
    role: string;
}

const CancelOrderAlert = ({ apiPath, id, role }: CancelOrderAlertProps) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.post(apiPath, { order_h_id: id, cancel_by: role });
            toast({
                variant: response.data.status === "ok" ? "success" : "destructive",
                description: response.data.message
            });
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
                <Button variant="destructive" className="bg-red-500 p-2 hover:bg-red-700 px-4 w-28" disabled={loading}>
                    {loading ? <HashLoader size={20} color={"#ffffff"} loading={loading} /> : t('Cancel')}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('Are you sure?')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('This action cannot be undone. Are you sure you want to cancel this order?')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading} className="bg-red-500 text-white hover:bg-red-600">{t('No')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-green-500 text-white hover:bg-green-600" disabled={loading}>
                        {loading ? <HashLoader size={20} color={"#ffffff"} loading={loading} /> : t('Yes')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default CancelOrderAlert;

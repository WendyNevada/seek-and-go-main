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
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
import { useLogin } from "@/context/LoginContext";
import { useTranslation } from "react-i18next";

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useNavigate } from "react-router-dom";

interface DeletePaymentAlertProps {
    apiPath: string;
    Id: number;
    param: string;
}

export function DeletePaymentAlert({ apiPath, Id, param }: DeletePaymentAlertProps) {
    const { t } = useTranslation();
    const { user } = useLogin();
    const navigate  = useNavigate();

    const handleDelete = async () => {
        try {
            const response = await axiosClient.post(apiPath, { [param]: Id });
            toast({
                variant: response.data.status === "ok" ? "success" : "destructive",
                description: response.data.message
            });
            if (response.data.status === "ok") {
                navigate('/Agency/EditProfileAgency/' + user?.agency_id);
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
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <HighlightOffIcon className='cursor-pointer hover:text-red-600'/>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('Are you sure?')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('This action cannot be undone. Are you sure you want to delete this product?')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>{t('Continue')}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

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
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
import { useLogin } from "@/context/LoginContext";
import { urlConstant } from "@/urlConstant";
import { useTranslation } from "react-i18next";

interface DeleteProductAlertProps {
    apiPath: string;
    Id: number;
    param: string;
}

export function AlertDialogProduct({ apiPath, Id, param }: DeleteProductAlertProps) {
    // const { navigateTo } = useLogin(urlConstant.AgencyProduct);
    const { t } = useTranslation();

    const handleDelete = async () => {
        try {
            const response = await axiosClient.post(apiPath, { [param]: Id });
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
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className="ml-2">
                    <DeleteOutlineIcon />
                </Button>
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

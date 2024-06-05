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
import { useTranslation } from "react-i18next";
import HashLoader from "react-spinners/HashLoader";

interface OrderAgencyFinishAlertProps {
    apiPath: string;
    id: number;
    role?: string | null;
    actionLoading: boolean;
    setActionLoading: (loading: boolean) => void;
    onAction: (apiPath: string, id: number) => Promise<void>;
}

const OrderAgencyFinishAlert = ({
    apiPath,
    id,
    actionLoading,
    onAction
}: OrderAgencyFinishAlertProps) => {
    const { t } = useTranslation();
    
    const handleFinishOrder = async () => {
        await onAction(apiPath,  id );
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button disabled={actionLoading} className='text-white bg-green-500 hover:bg-green-600'>
                    {actionLoading ? <HashLoader size={20} color={"#ffffff"} /> : t('Finish')}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('Are you sure?')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('This action will finish the order, do you want to continue?')}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-red-500 text-white hover:bg-red-600">{t('No')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleFinishOrder} className="bg-green-500 text-white hover:bg-green-600">
                        {actionLoading ? <HashLoader size={20} color={"#ffffff"} /> : t('Yes')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default OrderAgencyFinishAlert
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

interface OrderAgencySendEmailAlertProps {
    apiPath: string;
    id: number;
    role?: string | null;
    actionLoading: boolean;
    setActionLoading: (loading: boolean) => void;
    onAction: (apiPath: string, id: number) => Promise<void>;
}

const OrderAgencySendEmailAlert = ({
    apiPath,
    id,
    actionLoading,
    onAction
}: OrderAgencySendEmailAlertProps) => {

    const { t } = useTranslation();

    const handleSendEmailOrder = async () => {
        await onAction(apiPath, id);
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button disabled={actionLoading} className='text-white bg-orange-500 hover:bg-orange-600'>
                    {actionLoading ? <HashLoader size={20} color={"#ffffff"} /> : t('Send Email')}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('Are you sure?')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('This will send an email reminder to the customer to continue the payment, do you want to continue?')}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-red-500 text-white hover:bg-red-600">{t('No')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSendEmailOrder} className="bg-green-500 text-white hover:bg-green-600">
                        {actionLoading ? <HashLoader size={20} color={"#ffffff"} /> : t('Yes')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default OrderAgencySendEmailAlert

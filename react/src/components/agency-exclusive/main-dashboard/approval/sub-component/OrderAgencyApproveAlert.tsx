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

interface OrderAgencyApproveAlertProps {
    apiPath: string;
    id: number;
    role?: string | null;
    actionLoading: boolean;
    setActionLoading: (loading: boolean) => void;
    onAction: (apiPath: string, id: number) => Promise<void>;
}

const OrderAgencyApproveAlert = ({
    apiPath,
    id,
    actionLoading,
    onAction
}: OrderAgencyApproveAlertProps) => {
    const { t } = useTranslation();

    const handleApproveOrder = async () => {
        await onAction(apiPath, id);
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button disabled={actionLoading} className='text-white bg-green-500 hover:bg-green-600'>
                    {actionLoading ? <HashLoader size={20} color={"#ffffff"} /> : t('Approve')}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('Are you sure?')}</AlertDialogTitle>
                    <AlertDialogDescription>{t('Are you sure you want to approve this order?')}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-red-500 text-white hover:bg-red-600">{t('No')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleApproveOrder} className="bg-green-500 text-white hover:bg-green-600">
                        {actionLoading ? <HashLoader size={20} color={"#ffffff"} /> : t('Yes')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default OrderAgencyApproveAlert;

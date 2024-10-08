import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PayAccount } from '../../interface/interface';
import { useLogin } from '@/context/LoginContext';
import { hitAddApi } from '@/context/HitApi';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface CredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddPaymentModal = ({ isOpen, onClose }: CredentialModalProps) => {
    const { user } = useLogin();
    const navigate  = useNavigate();
    const { t } = useTranslation();

    const [account, setAccount] = useState<Partial<PayAccount>>({
        bank_name: '',
        account_no: '',
        account_name: '',
        payment_type: 'Bank Transfer',
    });

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setAccount(prevAccount => ({ ...prevAccount, [id]: value }));
    };

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const payload = { ...account, agency_id: user?.agency_id };
        const response = await hitAddApi("/v1/InsertAgencyPayment",payload);
        if (response === 200) {
            onClose();
            navigate('/Agency/EditProfileAgency/' + user?.agency_id);
            setTimeout(() => {
                window.location.reload();
            }, 100);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>{t('Add Payment Transfer')}</DialogTitle>
            </DialogHeader>
            <form onSubmit={onSubmit}>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="bank_name" className="text-right">
                        {t('Bank')}
                    </Label>
                    <Input
                        id="bank_name"
                        //value={account.account_name}
                        onChange={onChange}
                        className="col-span-3"
                    />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="account_no" className="text-right">
                            {t('Account No')}
                        </Label>
                        <Input
                            id="account_no"
                            //value={account.account_no}
                            onChange={onChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="account_name" className="text-right">
                        {t('Account Name')}
                    </Label>
                    <Input
                        id="account_name"
                        //value={account.account_name}
                        onChange={onChange}
                        className="col-span-3"
                    />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="payment_type" className="text-right">
                            {t('Payment Type')}
                        </Label>
                        <Input
                            id="payment_type"
                            value="Bank Transfer"
                            className="col-span-3"
                            disabled
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" variant="primary" className="bg-green-500 hover:bg-green-700">{t('Add Account No')}</Button>
                </DialogFooter>
            </form>
        </DialogContent>
        </Dialog>
    );
};

export default AddPaymentModal;

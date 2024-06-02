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

interface CredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddPaymentModal = ({ isOpen, onClose }: CredentialModalProps) => {
    const { user } = useLogin();
    const { navigateTo } = useLogin('/Agency/EditProfileAgency/' + user?.agency_id);

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
            navigateTo('/Agency/EditProfileAgency/' + user?.agency_id);
            setTimeout(() => {
                window.location.reload();
            }, 100);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Add Payment Account</DialogTitle>
            </DialogHeader>
            <form onSubmit={onSubmit}>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="bank_name" className="text-right">
                        Bank
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
                            Account No
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
                        Account Name
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
                            Payment Type
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
                    <Button type="submit" variant="primary">Add Account No</Button>
                </DialogFooter>
            </form>
        </DialogContent>
        </Dialog>
    );
};

export default AddPaymentModal;

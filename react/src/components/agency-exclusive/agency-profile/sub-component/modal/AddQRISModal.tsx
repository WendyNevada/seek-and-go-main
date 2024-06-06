import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Icon
import { useRef, useState } from "react";
import { PayAccount } from "../../interface/interface";
import { hitAddApi } from "@/context/HitApi";
import { useLogin } from "@/context/LoginContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface CredentialModalProps {
    isOpen: boolean;
    onClose: () => void;
  }

const AddQRISModal = ({ isOpen, onClose }: CredentialModalProps) => {
    const { user } = useLogin();
    //const { navigateTo } = useLogin('/Agency/EditProfileAgency/' + user?.agency_id);
    //const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [account, setAccount] = useState<Partial<PayAccount>>({
        bank_name: '',
        account_name: '',
        picture: undefined,
        payment_type: 'QRIS',
    });

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setAccount(prevAccount => ({ ...prevAccount, [id]: value }));

        if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
          setAccount(prevAccount => ({ ...prevAccount, picture: file }));
        }
    };

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('agency_id', String(user?.agency_id));
        formData.append('bank_name', String(account?.bank_name));
        formData.append('account_name', String(account?.account_name));
        formData.append('payment_type', String(account?.payment_type));
        if (account.picture) {
            formData.append('picture', account.picture);
        }

        const response = await hitAddApi("/v1/InsertAgencyPayment",formData);
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
            <DialogTitle>{t('Add QR Payment')}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <Card>
                    <CardContent className="p-6 space-y-4 max-w[23.5rem]">
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
                        <div className="space-y-2 text-sm">
                            <Label htmlFor="file" className="text-sm font-medium">
                                {t('File')}
                            </Label>
                            <Input
                                id="file"
                                type="file"
                                placeholder="File"
                                ref={fileInputRef}
                                onChange={onChange}
                                accept='.jpg, .jpeg, .png'/>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <DialogFooter>
                <Button type="submit" onClick={onSubmit} variant={'primary'} className="bg-green-500 hover:bg-green-700">{t('Confirm Upload')}</Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    )
}

export default AddQRISModal

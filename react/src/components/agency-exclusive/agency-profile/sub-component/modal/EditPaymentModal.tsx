import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PayAccount } from '../../interface/interface';
import { useLogin } from '@/context/LoginContext';
import { hitAddApi } from '@/context/HitApi';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface CredentialModalProps {
    isOpen: boolean;
    onClose: () => void;
    payment: PayAccount;
    onSave: (updatedPayment: PayAccount) => void;
}

const EditPaymentModal = ({ isOpen, onClose, payment, onSave }: CredentialModalProps) => {
    const { user } = useLogin();
    const  navigate  = useNavigate();
    const { t } = useTranslation();

    const [editedPayment, setEditedPayment] = useState<PayAccount>();
    // const enviUrl = import.meta.env.VITE_API_BASE_URL;
    // const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (payment) {
            setEditedPayment(payment);
        }
    }, [payment]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editedPayment && e.target.files && e.target.files.length > 0) {
            setEditedPayment({
                ...editedPayment,
                picture: e.target.files[0]
            })
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editedPayment) {
            const { id, value } = e.target;
            setEditedPayment({
                ...editedPayment,
                [id]: value
            });

            // const reader = new FileReader();
            // reader.onload = () => {
            //     const imagePreviewUrl = reader.result as string;
            //     setImagePreview(imagePreviewUrl); // Update image preview state
            // };
            // reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = async () => {
        if (editedPayment) {
            const formData = new FormData();
            formData.append('agency_payment_id', editedPayment?.agency_payment_id.toString());
            formData.append('account_no', editedPayment?.account_no);
            formData.append('account_name', editedPayment?.account_name);
            if(editedPayment.picture){
                formData.append('picture', editedPayment.picture);
            }

            try {
                await hitAddApi('v1/EditAgencyPayment', formData);
                onSave(editedPayment);
                if (editedPayment.picture !== null) {
                    navigate('/Agency/EditProfileAgency/' + user?.agency_id);
                    setTimeout(() => {
                        window.location.reload();
                    }, 100);
                }
                onClose();
            } catch (error) {
                console.log(error)
            }
        }
    }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] flex flex-col align-middle items-center">
        <DialogHeader>
          <DialogTitle>{t('Edit Payment Account')}</DialogTitle>
          <DialogDescription>
            {t('Make changes to your the payment method here. Click save when you are done')}
          </DialogDescription>
        </DialogHeader>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                {t('Account Name')}
                </Label>
                <Input
                id="account_name"
                defaultValue={payment?.account_name}
                onChange={handleInputChange}
                className="col-span-3"
                />
            </div>
            { (payment.image_url == '-') ? (
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                        {t('Account No')}
                        </Label>
                        <Input
                        id="account_no"
                        defaultValue={payment?.account_no}
                        onChange={handleInputChange}
                        className="col-span-3"
                        />
                    </div>
                </div>
            ):(
                <div className="space-y-4 items-center gap-4 justify-items-center">
                    {/* <img src={imagePreview || (enviUrl + payment.image_url)} className="col-span-3" /> */}
                    <Input
                        id="picture"
                        type="file"
                        accept='.jpg, .jpeg, .png'
                        onChange={handleFileChange}
                        className="col-span-3"
                    />
                </div>
            )}
        <DialogFooter>
          <Button variant={"primary"} className="bg-green-500 hover:bg-green-700" onClick={handleSaveChanges}>{t('Save Changes')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditPaymentModal

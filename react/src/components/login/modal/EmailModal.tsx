import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { hitAddApi } from "@/context/HitApi";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import HashLoader from "react-spinners/HashLoader";

interface CredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface email {
  email: string;
}

const EmailModal = ({ isOpen, onClose }:CredentialModalProps) => {
  const { t } = useTranslation();
  const [ loading, setLoading ] = useState(false);

  const form = useForm<email>({
    defaultValues: {
        email: "",
    }
})

    const forgetPassword = async (values: string) => {
      setLoading(true);
      await hitAddApi("v1/ForgotPasswordRequest",{email:values});
      setLoading(false);
      onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
            <DialogTitle className="text-center">{t('Input email here')}</DialogTitle>
            </DialogHeader>
                <Input placeholder={t('Email')} onChange={(e) => form.setValue("email", e.target.value)}></Input>
                <Button onClick={() => forgetPassword(form.getValues("email"))} variant="primary">
                  {loading ? (
                    <HashLoader size={20} color={"#ffffff"} loading={loading} />
                  ) : (
                    t('Send')
                  )}
                </Button>
            <DialogFooter>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default EmailModal
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { hitAddApi } from "@/context/HitApi";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface CredentialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface email {
  email: string;
}

const EmailModal = ({ isOpen, onClose }:CredentialModalProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const form = useForm<email>({
    defaultValues: {
        email: "",
    }
})

    const forgetPassword = async (values: string) => {
      await hitAddApi("v1/ForgotPasswordRequest",{email:values});
      onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
            <DialogTitle className="text-center">{t('Input email here')}</DialogTitle>
            </DialogHeader>
                <Input placeholder={t('Email')} onChange={(e) => form.setValue("email", e.target.value)}></Input>
                <Button onClick={() => forgetPassword(form.getValues("email"))} variant="primary">{t('Send')}</Button>
            <DialogFooter>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default EmailModal
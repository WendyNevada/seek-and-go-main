import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { useNavigate } from "react-router-dom";

interface CredentialModalProps {
    isOpen: boolean;
    onClose: () => void;
  }

const CredentialModal = ({ isOpen, onClose }:CredentialModalProps) => {
    const navigate = useNavigate();
    const goToLoginPage = () => {
        navigate('/Login');
    }

    const goToRegisterPage = () => {
        navigate('/Register');
    }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
            <DialogTitle className="text-center">Please Login First</DialogTitle>
            {/* <DialogDescription>
                Make changes to your profile here. Click save when you're done.
            </DialogDescription> */}
            </DialogHeader>
                <Button onClick={goToLoginPage} variant="primary">Login</Button>
                <h4 className="text-center">dont have an account ?</h4>
                <Button onClick={goToRegisterPage} variant="primary">Register</Button>
            <DialogFooter>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default CredentialModal

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PayAccount } from '../interface/interface';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import { throttle } from 'lodash';

//icon
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import AddPaymentModal from './modal/AddPaymentModal';
import { DeletePaymentAlert } from './modal/DeletePaymentAlert';
import EditPaymentModal from './modal/EditPaymentModal';
import AddQRISModal from './modal/AddQRISModal';

const EditAgencyPaymentAccount = ({ payment }: { payment: PayAccount[] }) => {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isQRISModalOpen, setIsQRISModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<PayAccount>();
    const [paymentRows, setPaymentRows] = useState<PayAccount[]>([]);
    // const lastCallTime = useRef<number | null>(null);
    const enviUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        if (payment && payment.length > 0) {
            setPaymentRows(payment);
        }
    }, [payment]);

    const addPaymentRow = () => {
        setIsModalOpen(true);
    };

    const addQRISPaymentRow = useCallback(throttle(() => {
        setIsQRISModalOpen(true);
    }, 1000), []);

    const editPaymentRow = (payment: PayAccount) => {
        setSelectedPayment(payment);
        setIsEditModalOpen(true);
    };

    const handleEditPayment = (updatedPayment: PayAccount) => {
        setPaymentRows((prevPayments) =>
            prevPayments.map((p) => (p.agency_payment_id === updatedPayment.agency_payment_id ? updatedPayment : p))
        );
    };

    return (
        <div>
            <div className="bg-white border-0 shadow-lg sm:rounded-3xl p-12 space-y-2 flex flex-col items-end">
                <div className="space-x-4">
                    <Button onClick={addPaymentRow} variant={'primary'} className="mt-4">
                        {t('Add Payment Transfer')}
                    </Button>
                    <Button onClick={addQRISPaymentRow} variant={'primary'} className="mt-4">
                        {t('Add QRIS')}
                    </Button>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>{t('Bank')}</TableHead>
                        <TableHead>{t('Account No')}</TableHead>
                        <TableHead>{t('Account Name')}</TableHead>
                        <TableHead>{t('Payment Type')}</TableHead>
                        <TableHead className="text-center">{t('Picture')}</TableHead>
                        <TableHead className="text-right">{t('Edit')}</TableHead>
                        <TableHead className="text-center">{t('Delete')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paymentRows.map((payment) => (
                        <TableRow key={payment.agency_payment_id}>
                            <TableCell className="font-medium">{payment.bank_name}</TableCell>
                            <TableCell>{payment.account_no}</TableCell>
                            <TableCell>{payment.account_name}</TableCell>
                            <TableCell>{payment.payment_type}</TableCell>
                            <TableCell className="text-center">
                                {(payment.image_url == '-') ? (
                                    <div>-</div>
                                ) : (
                                    <a href={enviUrl + payment.image_url} target="_blank" rel="noopener noreferrer">
                                        {t('Open Picture')}
                                    </a>
                                )}
                            </TableCell>
                            <TableCell className="text-right"><NoteAltIcon className='cursor-pointer hover:text-indigo-600' onClick={() => editPaymentRow(payment)}/></TableCell>
                            <TableCell className="text-center"><DeletePaymentAlert apiPath='/v1/RemoveAgencyPayment' Id={payment.agency_payment_id} param='agency_payment_id'/></TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
            </div>
            <AddPaymentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
            <AddQRISModal isOpen={isQRISModalOpen} onClose={() => setIsQRISModalOpen(false)}/>
            {selectedPayment && (
                <EditPaymentModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} payment={selectedPayment} onSave={handleEditPayment}/>
            )}
        </div>
    );
};

export default EditAgencyPaymentAccount;

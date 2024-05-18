import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import React from 'react'
import { OrderH } from '../utils/interface'
import {Table,TableBody,TableCaption,TableCell,TableHead,TableHeader,TableRow} from "@/components/ui/table"
import { useNavigate } from 'react-router-dom';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import { formatPrice } from '@/utils/priceFormating';
import { useTranslation } from 'react-i18next';

const AcordionByStatus = ( { orders, title }: { orders: OrderH[] | null ; title: string}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const onViewApprovalDetail = (id: number) => {
        navigate(`/Agency/Approval/${id}`)
    }

  return (
    <div>
        {(orders === null) ? (
        <Accordion key="no-data" type="single" collapsible>
          <AccordionItem value="item-no-data">
            <AccordionTrigger className="text-2xl font-bold">{title}</AccordionTrigger>
            <AccordionContent className='text-center'>
              <p>No data</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        ) : (
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-orders">
                        <AccordionTrigger className="text-2xl font-bold">{title}</AccordionTrigger>
                        <AccordionContent>
                                    {/* TABLE */}
                                    <Table>
                                        <TableCaption></TableCaption>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">{t('Order No')}</TableHead>
                                                <TableHead>{t('Order Date')}</TableHead>
                                                <TableHead>{t('Order Status')}</TableHead>
                                                <TableHead className="text-right">{t('Total Price')}</TableHead>
                                                <TableHead className="text-right">Detail</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        {orders.length === 0 ? (
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell colSpan={parseInt("5")} className="text-center">{t('No data')}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        ) : (
                                            <TableBody>
                                                {orders.map((order) => (
                                                    <TableRow key={order.order_h_id}>
                                                        <TableCell className="font-medium">{order.order_no}</TableCell>
                                                        <TableCell>{order.order_dt.slice(0, 10)}</TableCell>
                                                        <TableCell>{order.order_status} </TableCell>
                                                        <TableCell className="text-right">{formatPrice(order.total_price)}</TableCell>
                                                        <TableCell className="text-right"><NoteAltIcon className='cursor-pointer hover:text-indigo-600' onClick={() => onViewApprovalDetail(order.order_h_id)}/></TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        )}
                                    </Table>

                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
        )}
    </div>
  )
}

export default AcordionByStatus

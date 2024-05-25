
import { useEffect, useState } from 'react'
import AcordionByStatus from './Acordion/AcordionByStatus'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import axiosClient from '@/axios.client';
import { useLogin } from '@/context/LoginContext';
import { OrderH } from './utils/interface';

// interface NewOrderProps {
//     orders: Order[];
// }

const AgencyAccordion = () => {
    const [selectedValue, setSelectedValue] = useState('ALL');
    const [orders, setOrders] = useState<OrderH[]>([]);
    const { user } = useLogin();

  // Handler function to update the selected value
    const handleValueChange = (newValue: string) => {
        setSelectedValue(newValue);
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axiosClient.post('v1/GetOrderDashboardByAgencyIdAndStatus', { agency_id: user?.agency_id, status: 'ALL' });
                setOrders(response.data.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrders();
    }, [selectedValue]);

    return (
        <div>
            <Select
                onValueChange={handleValueChange}
                >
                <SelectTrigger className='w-40'>
                    <SelectValue placeholder={selectedValue}/>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL">ALL</SelectItem>
                    <SelectItem value="NEW">New Order</SelectItem>
                    <SelectItem value="APV">Approved</SelectItem>
                    <SelectItem value="RJT">Rejected</SelectItem>
                    <SelectItem value="CAN">Cancel Order</SelectItem>
                    <SelectItem value="PAY">Paid Order</SelectItem>
                    <SelectItem value="CPY">Customer Paid Orders</SelectItem>
                    <SelectItem value="RTP">Retry Payment</SelectItem>
                    <SelectItem value="FIN">Finished Order</SelectItem>
                </SelectContent>
            </Select>

            {(selectedValue === 'NEW' || selectedValue === 'ALL') &&
            <AcordionByStatus orders={orders.length > 0 ? orders.filter(orders => orders.order_status === "NEW") : null} title="New Orders"/>}

            {(selectedValue === 'APV' || selectedValue === 'ALL') &&
            <AcordionByStatus orders={orders.length > 0 ? orders.filter(orders => orders.order_status === "APV") : null} title="Approved Orders"/>}

            {(selectedValue === 'RJT' || selectedValue === 'ALL') &&
            <AcordionByStatus orders={orders.length > 0 ? orders.filter(orders => orders.order_status === "RJT") : null} title="Rejected Orders"/>}

            {(selectedValue === 'CAN' || selectedValue === 'ALL') &&
            <AcordionByStatus orders={orders.length > 0 ? orders.filter(orders => orders.order_status === "CAN") : null} title="Canceled Orders"/>}

            {(selectedValue === 'PAY' || selectedValue === 'ALL') &&
            <AcordionByStatus orders={orders.length > 0 ? orders.filter(orders => orders.order_status === "PAY") : null} title="Paid Orders"/>}

            {(selectedValue === 'CPY' || selectedValue === 'ALL') &&
            <AcordionByStatus orders={orders.length > 0 ? orders.filter(orders => orders.order_status === "CPY") : null} title="Customer Paid Orders"/>}

            {(selectedValue === 'RTP' || selectedValue === 'ALL') &&
            <AcordionByStatus orders={orders.length > 0 ? orders.filter(orders => orders.order_status === "RTP") : null} title="Retry Payment"/>}

            {(selectedValue === 'FIN' || selectedValue === 'ALL') &&
            <AcordionByStatus orders={orders.length > 0 ? orders.filter(orders => orders.order_status === "FIN") : null} title="Finished Order"/>}
        </div>
  )
}

export default AgencyAccordion

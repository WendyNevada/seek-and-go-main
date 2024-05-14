
import React, { useEffect, useState } from 'react'
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
                    <SelectItem value="PAY">Payment</SelectItem>
                    <SelectItem value="CPY">Cancel Payment</SelectItem>
                    <SelectItem value="RTP">Retry Payment</SelectItem>
                </SelectContent>
            </Select>

            {(selectedValue === 'NEW' || selectedValue === 'ALL') &&
            <AcordionByStatus orders={orders.length > 0 ? orders.filter(orders => orders.order_status === "NEW") : null} title="New Orders"/>}

            {(selectedValue === 'APV' || selectedValue === 'ALL') &&
            <AcordionByStatus orders={orders.length > 0 ? orders.filter(orders => orders.order_status === "APV") : null} title="Approved Orders"/>}

            {(selectedValue === 'RJT' || selectedValue === 'ALL') &&
            <AcordionByStatus orders={orders.length > 0 ? orders.filter(orders => orders.order_status === "APV") : null} title="Rejected Orders"/>}

            {(selectedValue === 'CAN' || selectedValue === 'ALL') &&
            <AcordionByStatus orders={orders.length > 0 ? orders.filter(orders => orders.order_status === "CAN") : null} title="Cancel Orders"/>}

            {(selectedValue === 'PAY' || selectedValue === 'ALL') &&
            <AcordionByStatus orders={orders.length > 0 ? orders.filter(orders => orders.order_status === "PAY") : null} title="Payment"/>}

            {(selectedValue === 'CPY' || selectedValue === 'ALL') &&
            <AcordionByStatus orders={orders.length > 0 ? orders.filter(orders => orders.order_status === "CPY") : null} title="Cancel Payment"/>}

            {(selectedValue === 'RTP' || selectedValue === 'ALL') &&
            <AcordionByStatus orders={orders.length > 0 ? orders.filter(orders => orders.order_status === "RTP") : null} title="Retry Payment"/>}
        </div>
  )
}

export default AgencyAccordion

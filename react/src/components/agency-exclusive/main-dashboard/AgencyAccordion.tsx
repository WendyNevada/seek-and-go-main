
import React, { useEffect, useState } from 'react'
import NewOrder from './Acordion/NewOrder'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import axiosClient from '@/axios.client';
import { useLogin } from '@/context/LoginContext';
import { Order } from './utils/interface';
import PayedOrder from './Acordion/PayedOrder';

// interface NewOrderProps {
//     orders: Order[];
// }

const AgencyAccordion = () => {
    const [selectedValue, setSelectedValue] = useState('ALL');
    const [orders, setOrders] = useState<Order[]>([]);
    const { user } = useLogin();

  // Handler function to update the selected value
    const handleValueChange = (newValue: string) => {
        setSelectedValue(newValue);
        console.log('hwhwhw', orders)
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axiosClient.post('v1/GetOrderDashboardByAgencyIdAndStatus', { agency_id: user?.agency_id, status: 'ALL' });
                setOrders(response.data);
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
            <NewOrder orders={orders.length > 0 ? orders.filter(orders => orders.order_status === "NEW") : null} />}

            {/* {(selectedValue === 'PAY' || selectedValue === 'ALL') && <PayedOrder orders={orders.length > 0 ? orders : null}/>} */}
        </div>
  )
}

export default AgencyAccordion

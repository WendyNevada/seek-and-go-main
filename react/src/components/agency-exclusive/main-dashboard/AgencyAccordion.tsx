
import React, { useEffect, useState } from 'react'
import NewOrder from './Acordion/NewOrder'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import axiosClient from '@/axios.client';
import { useLogin } from '@/context/LoginContext';
import { Order } from './utils/interface';

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
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axiosClient.post('GetOrderDashboardByAgencyIdAndStatus', { agency_id: user?.agency_id, order_status: 'ALL' });
                setOrders(response.data);
                console.log('hwhwhw', response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrders();
    }, []);

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

            {(selectedValue === 'NEW' || selectedValue === 'ALL') && <NewOrder orders={orders}/>}
        </div>
  )
}

export default AgencyAccordion

import axiosClient from '@/axios.client'
import { OrderD } from '@/components/agency-exclusive/main-dashboard/utils/interface';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/utils/priceFormating';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const MyOrder = ({customer_id}: {customer_id:number}) => {
    const [ order, setOrder ] = useState<OrderD[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('customer_id : ', customer_id)
        const fetchData = async () => {
            try {
                const response = await axiosClient.post('v1/GetCustomerOrderByIdAndStatus', { customer_id: customer_id, order_status: "ALL" });
                setOrder(response.data.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [customer_id])

    const navigateOrderDetail = (order_h_id: number) => {
        navigate('/Customer/OrderDetail/' + order_h_id);
    }

    return (
        <div className='w-[80rem]'>
            {/* header */}
            <div className='flex flex-col items-left text-left mt-4'>
                <p className='text-5xl py-2 my-8'>MY ORDERS</p>
            </div>

            <div className="block rounded-lg bg-blue-100 shadow-secondary-1 dark:bg-surface-dark p-10 shadow-xl">
                {order.length > 0 ? (
                    order.map((order) => (
                        <div className='bg-white rounded-lg p-4 space-y-3 space-x-56 flex flex-row align-center' key={order.order_h_id}>
                            <div className="flex flex-col">
                                <div className='text-sm bg-blue-500 w-max p-2 rounded-3xl text-white flex flex-row'>
                                    <p className='font-bold mr-5'>ORDER</p>
                                    <p>{order.order_no}</p>
                                </div>
                                <div className="text-sm w-max p-2 rounded-3xlflex flex-row">
                                    <p className='font-bold text-lg'>{order.agency_name}</p>
                                    <p className='font-bold text-lg'>{formatPrice(order.total_price)}</p>
                                </div>
                            </div>

                            <div className="flex flex-row ml-6 space-x-12 items-center">
                                <div className='text-sm w-max p-2 rounded-3xl flex flex-col'>
                                    <p className='font-bold mr-5'>Date</p>
                                    <p className='font-bold text-lg text-blue-500'>{order.order_dt}</p>
                                </div>
                                <div className="text-sm w-max p-2 rounded-3xl flex flex flex-col">
                                    <p className='text-sm font-bold'>Status</p>
                                    <p className='font-bold text-lg text-blue-500'>{order.order_status}</p>
                                </div>
                            </div>
                            <div className="flex flex-row ml-24 items-center">
                                <Button variant={'primary'} className='w-[10rem]' onClick={() => navigateOrderDetail}>Detail</Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No orders found.</p>
                )}
            </div>
        </div>
    )
}

export default MyOrder

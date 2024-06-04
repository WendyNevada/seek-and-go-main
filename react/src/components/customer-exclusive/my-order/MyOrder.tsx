import axiosClient from '@/axios.client'
import { OrderD } from '@/components/agency-exclusive/main-dashboard/utils/interface';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatPrice } from '@/utils/priceFormating';
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import HashLoader from 'react-spinners/HashLoader';

const MyOrder = ({customer_id}: {customer_id:number}) => {
    const [ order, setOrder ] = useState<OrderD[]>([]);
    const [ loading, setLoading ] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [status, setStatus] = useState('ALL');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axiosClient.post('v1/GetCustomerOrderByIdAndStatus', { customer_id: customer_id, order_status: status });
                if(response.data.status == "error") {
                    setOrder([]);
                } else {
                    setOrder(response.data.data);
                }
            } catch (error) {
                console.error(error);
                setOrder([]);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [status, customer_id])

    const navigateOrderDetail = (order_h_id: number) => {
        navigate('/Customer/MyOrderDetail/' + order_h_id);
    }

    const handleValueChange = (newValue: string) => {
        setOrder([]);
        setStatus(newValue);
    };

    return (
        <div className='w-[80rem]'>
            {/* header */}
            <div className='flex flex-col items-left text-left mt-4 mb-4'>
                <p className='text-5xl py-2 my-8'>{t('My Orders')}</p>
                <Select
                    onValueChange={handleValueChange}
                >
                    <SelectTrigger className='w-64'>
                        <SelectValue placeholder={t('All')}/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">{t('All')}</SelectItem>
                        <SelectItem value="NEW">New Order</SelectItem>
                        <SelectItem value="APV">Approved Order</SelectItem>
                        <SelectItem value="RJT">Rejected Order</SelectItem>
                        <SelectItem value="CAN">Cancel Order</SelectItem>
                        <SelectItem value="PAY">Paid Order</SelectItem>
                        <SelectItem value="CPY">Customer Paid Orders</SelectItem>
                        <SelectItem value="RTP">Retry Payment Order</SelectItem>
                        <SelectItem value="FIN">Finished Order</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="block rounded-lg bg-blue-100 shadow-secondary-1 dark:bg-surface-dark p-10 shadow-xl">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <HashLoader size={50} color={"#123abc"} loading={loading} />
                    </div>
                ) : (
                    order.length > 0 ? (
                        order.map((order) => (
                            <div className='bg-white rounded-lg p-4 space-y-3 space-x-56 flex flex-row align-center mb-4' key={order.order_h_id}>
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
                                        <p className='font-bold text-lg text-blue-500'>{order.order_dt.split(' ')[0]}</p>
                                    </div>
                                    <div className="text-sm w-max p-2 rounded-3xl flex flex flex-col">
                                        <p className='text-sm font-bold'>Status</p>
                                        <p className='font-bold text-lg text-blue-500'>{order.order_status}</p>
                                    </div>
                                </div>
                                <div className="flex flex-row ml-24 items-center">
                                    <Button variant={'primary'} className='w-[10rem]' onClick={() => navigateOrderDetail(order.order_h_id)}>Detail</Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>{t('No orders found')}</p>
                    )
                )}
            </div>
        </div>
    )
}

export default MyOrder

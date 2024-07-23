import axiosClient from '@/axios.client';
import { useEffect, useState } from 'react'
import { OrderD } from '../utils/interface';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import axios from 'axios';
import { TableFooter } from '@mui/material';
import { useTranslation } from 'react-i18next';
import HashLoader from 'react-spinners/HashLoader';
import OrderAgencyRejectAlert from './sub-component/OrderAgencyRejectAlert';
import OrderAgencyApproveAlert from './sub-component/OrderAgencyApproveAlert';
import OrderAgencySendEmailAlert from './sub-component/OrderAgencySendEmailAlert';
import OrderAgencyCancelAlert from './sub-component/OrderAgencyCancelAlert';
import OrderAgencyFinishAlert from './sub-component/OrderAgencyFinishAlert';
import OrderAgencyAcceptPaymentAlert from './sub-component/OrderAgencyAcceptPaymentAlert';
import OrderAgencyRetryPaymentAlert from './sub-component/OrderAgencyRetryPaymentAlert';
import { formatPrice } from '@/utils/priceFormating';

interface OrderDataRow {
    order_h_id : number,
    hotel_name : string,
    vehicle_name : string,
    attraction_name : string,
    start_dt : string,
    end_dt : string,
    qty : number,
    price : number,
    total_price : number
}

const OrderApproval = ({order_h_id} : {order_h_id: number}) => {
    const { t } = useTranslation();
    const [order, setOrder] = useState<OrderD>({} as OrderD);
    // const [hotel, setHotel] = useState<HotelH[]>();
    // const [vehicle, setVehicle] = useState<VehicleH[]>();
    // const [attraction, setAttraction] = useState<AttractionH[]>();
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [orderDataRows, setOrderDataRows] = useState<OrderDataRow[]>([]);
    const [imageUrl, setImageUrl] = useState<string | undefined>('');
    const enviUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.post('v1/GetOrderById', { order_h_id });
                const orderData: OrderD = response.data;

                if(response.status === 200) {
                    const responseImg = await axiosClient.post('v1/GetOrderImage', {order_h_id});
                    setImageUrl(responseImg.data.image_url);   
                }

                const fetchDetails = orderData.order_ds.map(async (orderD) => {
                    let hotel_name = '';
                    let vehicle_name = '';
                    let attraction_name = '';
                    let price = 0;

                    if (orderD.ref_hotel_id != null) {
                        const responseHotel = await axiosClient.post('v1/GetHotelById', { ref_hotel_id: orderD.ref_hotel_id });
                        hotel_name = responseHotel.data.hotel.hotel_name;
                        price = responseHotel.data.base_price;
                    } else if (orderD.ref_vehicle_id != null) {
                        const responseVehicle = await axiosClient.post('v1/GetVehicleById', { ref_vehicle_id: orderD.ref_vehicle_id });
                        vehicle_name = responseVehicle.data.vehicle.vehicle_name;
                        price = responseVehicle.data.base_price;
                    } else if (orderD.ref_attraction_id != null) {
                        const responseAttraction = await axiosClient.post('v1/GetAttractionById', { ref_attraction_id: orderD.ref_attraction_id });
                        attraction_name = responseAttraction.data.attraction.attraction_name;
                        price = responseAttraction.data.base_price;
                    }

                    price = price;

                    return {
                        order_h_id: orderData.order_h_id,
                        hotel_name,
                        vehicle_name,
                        attraction_name,
                        start_dt: orderD.start_dt,
                        end_dt: orderD.end_dt,
                        qty: orderD.qty,
                        price : orderD.price || 0,
                        total_price: orderD.price || 0
                    };
                });

                const details = await Promise.all(fetchDetails);
                setOrder(orderData);
                setOrderDataRows(details);
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    },[order_h_id])

    // const formatPrice = (price: number): string => {
    //     if (typeof price !== 'undefined' && !isNaN(price)) {
    //         // Format the price using toLocaleString
    //         return price.toLocaleString('id-ID', {
    //             style: 'currency',
    //             currency: 'IDR'
    //         });
    //     } else {
    //         // Handle undefined or non-numeric inputs
    //         return 'N/A'; // Or any default value or error message you prefer
    //     }
    // };

    const onAction = async (apiPath: string, id: number) => {
        setActionLoading(true);
        try {
            const response = await axiosClient.post(apiPath, {order_h_id : id});

            if (response.data.status === "ok") {
                toast({
                    variant: "success",
                    description: response.data.message,
                });
                setTimeout(() => {
                    window.location.reload();
                }, 100);
            }
        } catch (error) {
            const errorMessage = axios.isAxiosError(error) && error.response
                ? error.response.data.message
                : "An unexpected error occurred";
            toast({
                variant: "destructive",
                description: errorMessage,
            });
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <>
            {loading ? (
            <div className="flex justify-center items-center min-h-screen">
                <HashLoader size={50} color={"#123abc"} loading={loading} />
            </div>
        ) : (
            <>
                <div className='shadow-lg sm:rounded-3xl'>
            {/* Header */}
            <div className='p-5 text-xl flex flex-row'>
                <div className="">
                    {t('Order No')}
                    <br />
                    {t('Order Status')}
                    <br />
                    {t('Total Price')}
                    <br />
                    {t('Customer Name')}
                    <br />
                    {t('Customer Email')}
                    <br />
                    {t('Customer Phone')}
                </div>
                <div className="ml-4">
                    : {order.order_no}
                    <br />
                    : {order.order_status}
                    <br />
                    : {formatPrice(order.total_price)}
                    <br />
                    : {order.customer_name}
                    <br />
                    : {order.customer_email}
                    <br />
                    : {order.customer_phone}
                </div>
            </div>

            {/* Table */}
            <div className="p-5 text-xl flex flex-col">
                <hr className='border-2'/>
                <br />
                <div className="">
                <Table>
                    <TableCaption></TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('Product')}</TableHead>
                            <TableHead className="w-36">{t('From')}</TableHead>
                            <TableHead>{t('To')}</TableHead>
                            <TableHead>{t('Amount')}</TableHead>
                            <TableHead className="text-center">{t('Price')}</TableHead>
                            <TableHead className="text-right">{t('Sub Total')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orderDataRows && orderDataRows.length > 0 ? (
                            orderDataRows.map((dataRow, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {dataRow.hotel_name || dataRow.vehicle_name || dataRow.attraction_name || "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        {dataRow.start_dt?.split(" ")[0] || "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        {dataRow.end_dt?.split(" ")[0] || "N/A"}
                                    </TableCell>
                                    {
                                        order.order_ds[0].package_h_id == null ? (
                                            <>
                                                <TableCell>
                                                    {dataRow.qty || "N/A"}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {formatPrice(dataRow.price)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatPrice(dataRow.total_price * dataRow.qty)}
                                                </TableCell>
                                            </>
                                        ):(
                                            <>
                                                <TableCell>
                                                    -
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    -
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    -
                                                </TableCell>
                                            </>
                                        )
                                    }
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    No order details available.
                                </TableCell>
                            </TableRow>
                        )}
                        <TableRow>
                            <TableCell>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                    <TableFooter>
                        <TableRow className='bg-slate-500 hover:bg-slate-500 text-white'>
                            <TableCell colSpan={5} className='font-bold'>{t('Total Price')}</TableCell>
                            <TableCell className="text-right font-bold">{formatPrice(order.total_price)}</TableCell>
                        </TableRow>
                    </TableFooter>
                    </Table>
                </div>
            </div>

            {(order.order_status === 'CPY' || order.order_status === 'RTP') && (
                <div className='flex justify-center items-center flex-col'>
                    <div className="flex justify-center items-center mt-3">
                        <p className="font-bold">{t('Proof of Payment')}</p>
                    </div>
                    {imageUrl !== '-' ? (
                        <div className='mt-4'>
                            <img src={enviUrl + imageUrl} alt="Loading..." style={{ maxWidth: '100%', marginTop: '10px' }} />
                        </div>
                    ) : (
                    <>
                        <div className="flex justify-center items-center mt-2">
                            <p className="font-bold text-red-500">{t('Not Available')}</p>
                        </div>
                    </>
                    )}
                </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end m-4 p-4">

                {order.order_status === 'NEW' && (
                    <div className="space-x-4">
                    <OrderAgencyRejectAlert
                        apiPath={'v1/RejectOrder'}
                        id={order_h_id}
                        actionLoading={actionLoading}
                        setActionLoading={setActionLoading}
                        onAction={onAction}
                    />
                    <OrderAgencyApproveAlert
                        apiPath={'v1/ApproveOrder'}
                        id={order_h_id}
                        actionLoading={actionLoading}
                        setActionLoading={setActionLoading}
                        onAction={onAction}
                    />
                </div>
                )}

                {order.order_status === 'APV' && (
                    <div className="space-x-4">
                        <OrderAgencySendEmailAlert
                            apiPath={'v1/SendEmailOrderApprove'}
                            id={order_h_id}
                            actionLoading={actionLoading}
                            setActionLoading={setActionLoading}
                            onAction={onAction}
                        />

                        <OrderAgencyCancelAlert
                            apiPath={'v1/CancelOrderAgency'}
                            id={order_h_id}
                            role={'agency'}
                            actionLoading={actionLoading}
                            setActionLoading={setActionLoading}
                            onAction={onAction}
                        />
                    </div>
                )}

                {order.order_status === 'PAY' && (
                    <div className="space-x-4">
                        <OrderAgencyFinishAlert
                            apiPath={'v1/FinishOrder'}
                            id={order_h_id}
                            role={'agency'}
                            actionLoading={actionLoading}
                            setActionLoading={setActionLoading}
                            onAction={onAction}
                        />
                    </div>
                )}

                {order.order_status === 'CPY' && (
                    <div>
                        <div className="space-x-4">
                            <OrderAgencyAcceptPaymentAlert
                                apiPath={'v1/PaidOrder'}
                                id={order_h_id}
                                role={'agency'}
                                actionLoading={actionLoading}
                                setActionLoading={setActionLoading}
                                onAction={onAction}
                            />

                            <OrderAgencyRetryPaymentAlert
                                apiPath={'v1/RetryPaymentOrder'}
                                id={order_h_id}
                                role={'agency'}
                                actionLoading={actionLoading}
                                setActionLoading={setActionLoading}
                                onAction={onAction}
                            />

                            <OrderAgencyCancelAlert
                                apiPath={'v1/CancelOrderAgency'}
                                id={order_h_id}
                                role={'agency'}
                                actionLoading={actionLoading}
                                setActionLoading={setActionLoading}
                                onAction={onAction}
                            />
                        </div>
                    </div>
                )}

                {order.order_status === 'RTP' && (
                    <div className="space-x-4">
                        <OrderAgencyAcceptPaymentAlert
                            apiPath={'v1/PaidOrder'}
                            id={order_h_id}
                            role={'agency'}
                            actionLoading={actionLoading}
                            setActionLoading={setActionLoading}
                            onAction={onAction}
                        />

                        <OrderAgencyCancelAlert
                            apiPath={'v1/CancelOrderAgency'}
                            id={order_h_id}
                            role={'agency'}
                            actionLoading={actionLoading}
                            setActionLoading={setActionLoading}
                            onAction={onAction}
                        />
                    </div>
                )}

            </div>
        </div>
            </>
        )}
        </>

    )
}

export default OrderApproval

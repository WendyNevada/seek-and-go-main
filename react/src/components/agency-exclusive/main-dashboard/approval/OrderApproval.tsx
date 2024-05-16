import axiosClient from '@/axios.client';
import React, { useEffect, useState } from 'react'
import { OrderD } from '../utils/interface';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HotelH } from '../utils/interfaceHotel';
import { VehicleH } from '../utils/interfaceVehicle';
import { AttractionH } from '../utils/interfaceAttraction';
import { Button } from "@/components/ui/button"
import { toast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import { TableFooter } from '@mui/material';
import { useTranslation } from 'react-i18next';

const OrderApproval = ({order_h_id} : {order_h_id: number}) => {
    const { t } = useTranslation();
    const [order, setOrder] = useState<OrderD>({} as OrderD);
    const [hotel, setHotel] = useState<HotelH>();
    const [vehicle, setVehicle] = useState<VehicleH>();
    const [attraction, setAttraction] = useState<AttractionH>();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.post('v1/GetOrderById', { order_h_id: order_h_id });
                setOrder(response.data);

                if(response.data.order_ds.length > 0) {
                    const orderD = response.data.order_ds[0];
                    if(orderD.ref_hotel_id != null){
                        const responseHotel = await axiosClient.post('v1/GetHotelById', { ref_hotel_id: orderD.ref_hotel_id });
                        setHotel(responseHotel.data);
                    }
                    else if(orderD.ref_vehicle_id != null){
                        const responseVehicle = await axiosClient.post('v1/GetVehicleById', { ref_vehicle_id: orderD.ref_vehicle_id });
                        setVehicle(responseVehicle.data);
                    }
                    else if(orderD.ref_attraction_id != null){
                        const responseAttraction = await axiosClient.post('v1/GetAttractionById', { ref_attraction_id: orderD.ref_attraction_id });
                        setAttraction(responseAttraction.data);
                    }
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchData();
    },[order_h_id])

    const formatPrice = (price: number): string => {
        if (typeof price !== 'undefined' && !isNaN(price)) {
            // Format the price using toLocaleString
            return price.toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR'
            });
        } else {
            // Handle undefined or non-numeric inputs
            return 'N/A'; // Or any default value or error message you prefer
        }
    };

    const onApproveOrder = async (order_h_id : number) => {
        try {
            const response = await axiosClient.post('v1/ApproveOrder', { order_h_id: order_h_id });

            if(response.data.Status == "ok") {
                toast({
                    variant: "success",
                    description: "Item added."
                });
            }
        } catch (response) {
            const axiosError = response as AxiosError; // Cast the error to AxiosError
            if (axios.isAxiosError(response)) { // Check if the error is an AxiosError
                toast({
                    variant: "destructive",
                    description: (axiosError.response?.data as { message: string })?.message,
                });
            }
        }
    }

    const onSendEmailOrder = async (order_h_id : number) => {    
    }

    const onRejectOrder = async (order_h_id : number) => {
    }

    const onCancelOrder = async (order_h_id : number) => {
    }

    const onAcceptPaymentOrder = async (order_h_id : number) => {
    }

    const onRetryPaymentOrder  = async (order_h_id : number) => {
    }

    const onFinishOrder = async (order_h_id : number) => {
    }

    return (
        <div className='shadow-lg sm:rounded-3xl'>
            {/* Header */}
            <div className='p-5 text-xl flex flex-row'>
                <div className="">
                    {t('Order No')}
                    <br />
                    {t('Order Status')}
                    <br />
                    {t('Total Price')}
                </div>
                <div className="ml-4">
                    : {order.order_no}
                    <br />
                    : {order.order_status}
                    <br />
                    : {formatPrice(order.total_price)}
                </div>
            </div>

            <div className="p-5 text-xl flex flex-col">
                Detail
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
                        <TableRow>
                            <TableCell>{hotel || vehicle || attraction ?
                                (hotel ? hotel.hotel.hotel_name :
                                    (vehicle ? vehicle.vehicle.vehicle_name :
                                        (attraction ? attraction.attraction.attraction_name : "N/A"))) :"N/A"}
                            </TableCell>
                            <TableCell>{order.order_ds && order.order_ds.length > 0 ? order.order_ds[0].start_dt.split(" ")[0] : "N/A"}</TableCell>
                            <TableCell>{order.order_ds && order.order_ds.length > 0 ? order.order_ds[0].end_dt.split(" ")[0] : "N/A"}</TableCell>
                            <TableCell>{order.order_ds && order.order_ds.length > 0 ? order.order_ds[0].qty : "N/A"}</TableCell>
                            <TableCell className="text-right">{hotel || vehicle || attraction ?
                                (hotel ? formatPrice(hotel.base_price) : vehicle ? formatPrice(vehicle.base_price) : attraction ? formatPrice(attraction.base_price) : 0) : "N/A"}
                            </TableCell>
                            <TableCell className="text-right">{formatPrice(order.total_price)}</TableCell>
                        </TableRow>
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

            <div className="flex justify-end m-4 p-4">
                {order.order_status === 'NEW' && (
                    <div className="space-x-4">
                        <Button className='bg-red-500 p-2 hover:bg-red-700 px-4 w-24' onClick={() => onRejectOrder(order.order_h_id)}>Reject</Button>
                        <Button className='bg-blue-500 p-2 hover:bg-blue-700 px-4 w-24' onClick={() => onApproveOrder(order.order_h_id)}>Approve</Button>
                    </div>
                )}

                {order.order_status === 'APV' && (
                    <div className="space-x-4">
                        <Button className='bg-orange-500 p-2 hover:bg-orange-700 px-4 w-28' onClick={() => onSendEmailOrder(order.order_h_id)}>Send Email</Button>
                        <Button className='bg-red-500 p-2 hover:bg-red-700 px-4 w-28' onClick={() => onCancelOrder(order.order_h_id)}>Cancel</Button>
                    </div>
                )}

                {order.order_status === 'PAY' && (
                    <div className="space-x-4">
                        <Button className='bg-green-500 p-2 hover:bg-green-700 px-4 w-24' onClick={() => onFinishOrder(order.order_h_id)}>Finish</Button>
                    </div>
                )}

                {order.order_status === 'CPY' && (
                    <div className="space-x-4">
                        <Button className='bg-green-500 p-2 hover:bg-green-700 px-4 w-28' onClick={() => onAcceptPaymentOrder(order.order_h_id)}>Accept Payment</Button>
                        <Button className='bg-blue-500 p-2 hover:bg-blue-700 px-4 w-28' onClick={() => onRetryPaymentOrder(order.order_h_id)}>Retry Payment</Button>
                        <Button className='bg-red-500 p-2 hover:bg-red-700 px-4 w-28' onClick={() => onCancelOrder(order.order_h_id)}>Cancel</Button>
                    </div>
                )}

                {order.order_status === 'RTP' && (
                    <div className="space-x-4">
                        <Button className='bg-green-500 p-2 hover:bg-green-700 px-4 w-28' onClick={() => onAcceptPaymentOrder(order.order_h_id)}>Accept Payment</Button>
                        <Button className='bg-red-500 p-2 hover:bg-red-700 px-4 w-28' onClick={() => onCancelOrder(order.order_h_id)}>Cancel</Button>
                    </div>
                )}

            </div>
        </div>
    )
}

export default OrderApproval

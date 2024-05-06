import axiosClient from '@/axios.client';
import React, { useEffect, useState } from 'react'
import { OrderD } from '../utils/interface';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HotelH } from '../utils/interfaceHotel';

const OrderApproval = ({order_h_id} : {order_h_id: number}) => {
    const [order, setOrder] = useState<OrderD>({} as OrderD);
    const [hotel, setHotel] = useState<HotelH>();
    const [vehicle, setVehicle] = useState<VehicleH>();
    const [attraction, setAttraction] = useState<AttractionH>();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.post('v1/GetOrderById', { order_h_id: order_h_id });
                setOrder(response.data);
                if(order.order_ds.ref_hotel_id != null){
                    const responseHotel = await axiosClient.post('v1/GetHotelById', { ref_hotel_id: order.order_ds.ref_hotel_id });
                    setHotel(responseHotel.data);
                }
                else if(order.order_ds.ref_vehicle_id != null){
                    const responseVehicle = await axiosClient.post('v1/GetVehicleById', { ref_vehicle_id: order.order_ds.ref_vehicle_id });
                    setVehicle(responseVehicle.data);
                }
                else if(order.order_ds.ref_attraction_id != null){
                    const responseAttraction = await axiosClient.post('v1/GetAttractionById', { ref_attraction_id: order.order_ds.ref_attraction_id });
                    setAttraction(responseAttraction.data);
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

    return (
        <div className='shadow-lg sm:rounded-3xl'>
            {/* Header */}
            <div className='p-5 text-xl flex flex-row'>
                <div className="">
                    Order No
                    <br />
                    Order Status
                    <br />
                    Total Price
                </div>
                <div className="ml-4">
                    : {order.order_no}
                    <br />
                    : {order.order_status}
                    <br />
                    : Rp.{formatPrice(order.total_price)}
                </div>
            </div>

            <div className="p-5 text-xl flex flex-col">
                DETAIL
                <br />
                <div className="">
                <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[100px]">Invoice</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                        <TableCell className="font-medium">INV001</TableCell>
                        <TableCell>Paid</TableCell>
                        <TableCell>Credit Card</TableCell>
                        <TableCell className="text-right">$250.00</TableCell>
                        </TableRow>
                    </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default OrderApproval

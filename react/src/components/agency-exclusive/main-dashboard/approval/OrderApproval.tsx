import axiosClient from '@/axios.client';
import React, { useEffect, useState } from 'react'
import { OrderD } from '../utils/interface';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HotelH } from '../utils/interfaceHotel';
import { VehicleH } from '../utils/interfaceVehicle';
import { AttractionH } from '../utils/interfaceAttraction';
import { Button } from "@/components/ui/button"

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
                    : {formatPrice(order.total_price)}
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
                        <TableHead className="w-36">From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead className="text-right">Base Price</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>{order.order_ds && order.order_ds.length > 0 ? order.order_ds[0].start_dt.split(" ")[0] : "N/A"}</TableCell>
                            <TableCell>{order.order_ds && order.order_ds.length > 0 ? order.order_ds[0].end_dt.split(" ")[0] : "N/A"}</TableCell>
                            <TableCell>{order.order_ds && order.order_ds.length > 0 ? order.order_ds[0].qty : "N/A"}</TableCell>
                            <TableCell className="text-right">{hotel || vehicle || attraction ?
                                (hotel ? formatPrice(hotel.base_price) : vehicle ? formatPrice(vehicle.base_price) : attraction ? formatPrice(attraction.base_price) : 0) : "N/A"}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex justify-end m-4 p-4">
                <Button className=' bg-blue-500 p-2 hover:bg-blue-700 px-4'>Approve</Button>
            </div>
        </div>
    )
}

export default OrderApproval

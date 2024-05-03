import axiosClient from '@/axios.client';
import React, { useEffect, useState } from 'react'
import { VehicleRoot } from '../interface/interface';
import rating from '@/components/ui/Custom/rating';
import RoomIcon from '@mui/icons-material/Room';

const OrderDetail = ({ref_vehicle_id} : {ref_vehicle_id: number}) => {
    const [vehicle, setVehicle] = useState<VehicleRoot>();
    const enviUrl = import.meta.env.VITE_API_BASE_URL;
    const [image, setImage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.post('v1/GetVehicleById', { ref_vehicle_id: ref_vehicle_id });
                setVehicle(response.data);
                setImage(enviUrl + response.data.picture_url);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    },[ref_vehicle_id])

    return (
        <div>
            <div className="flex flex-col w-full sm:w[10rem] md:w-[40rem] lg:w-[80rem]">
                {/* OrderDetail {ref_vehicle_id}
                <br></br>
                {vehicle?.vehicle.qty} */}
                <label htmlFor="" className='font-bold text-4xl p-6'>{vehicle?.vehicle.vehicle_name}</label>
                <div className="px-6">
                    {rating(vehicle?.vehicle.rating ?? 0)}
                </div>
                <div className="lg:w-[80rem]">
                    <img src={image} alt="" className='rounded-2xl mt-2' style={{ maxWidth: '60rem', minWidth: '60rem' }}/>
                </div>
                <div className='flex flex-row space-x-80 mt-4'>
                    {/* kiri */}
                    <div className='flex flex-col lg:min-w-[40rem] sm:w-[20rem]'>
                        <h1>DESCRIPTION</h1>
                        <br></br>
                        {vehicle?.vehicle.description}
                        <br />
                        <h1>DETAIL ADDRESS : {vehicle?.vehicle.address}</h1>
                        <br />
                        <h1>{<RoomIcon/>}  ADDRESS : {vehicle?.address}</h1>
                    </div>

                    {/* kanan */}
                    <div className='flex flex-col'>
                        harga
                        <br />
                        <label htmlFor="" className='font-bold text-2xl'>{vehicle?.base_price}</label>
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'>Order</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetail

import React, { useEffect, useState } from 'react'
import { AttractionRoot } from '../interface/interface';
import axiosClient from '@/axios.client';
import rating from '@/components/ui/Custom/rating';

// icon
import DescriptionIcon from '@mui/icons-material/Description';
import RoomIcon from '@mui/icons-material/Room';

// public utils
import { formatPrice } from '@/utils/priceFormating';

const OrderAttractionDetail = ({ref_attraction_id} : {ref_attraction_id: number}) => {
    const [attraction, setAttraction] = useState<AttractionRoot>();
    const enviUrl = import.meta.env.VITE_API_BASE_URL;
    const [image, setImage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.post('v1/GetAttractionById', { ref_attraction_id: ref_attraction_id });
                setAttraction(response.data);
                setImage(enviUrl + response.data.picture_url);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    },[])

  return (
    <div>
        <div className="flex flex-col sm:w-[10rem] md:w-[40rem] lg:w-[80rem]">
            {/* OrderDetail {ref_vehicle_id}
            <br></br>
            {vehicle?.vehicle.qty} */}
            <label htmlFor="" className='font-bold text-4xl p-6'>{attraction?.attraction.attraction_name}</label>
            <div className="px-6 sm:w-64">
                {rating(attraction?.attraction.rating ?? 0)}
            </div>
            <div className="lg:w-[80rem] sm:max-w-md">
                <img src={image} alt="" className='rounded-2xl mt-2 xl:max-w-5xl sm:min-w-[45rem]'/>
            </div>
            <div className='flex flex-row space-x-30 sm:w-[35rem] mt-4'>
                {/* kiri */}
                <div className='flex flex-col xl:min-w-[58rem] lg:min-w-[40rem] sm:min-w-[35rem] px-4'>
                    <div className="">
                        {<DescriptionIcon/>}DESCRIPTION
                        <br></br>
                        {attraction?.attraction.description}

                    </div>

                    <br />
                    <div className="mt-4">
                        {<RoomIcon/>} LOCATION
                        <br />
                        <h1>DETAIL ADDRESS : {attraction?.attraction.address}</h1>
                        <h1>ADDRESS : {attraction?.address}</h1>
                    </div>

                </div>

                {/* kanan */}
                <div className='flex flex-col px-2'>
                    <h1>HARGA :</h1>
                    <label htmlFor="" className='font-bold text-2xl'> {formatPrice(attraction?.base_price ?? 0)}</label>
                    <button className='bg-gradient-to-r from-green-300 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white font-bold py-2 px-4 rounded mt-4'>Order</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default OrderAttractionDetail

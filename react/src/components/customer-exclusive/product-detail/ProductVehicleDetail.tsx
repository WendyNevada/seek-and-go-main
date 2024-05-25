import axiosClient from '@/axios.client';
import React, { useEffect, useState } from 'react'
import { VehicleRoot } from '../interface/interface';
import rating from '@/components/ui/Custom/rating';
import RoomIcon from '@mui/icons-material/Room';
import DescriptionIcon from '@mui/icons-material/Description';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { formatPrice } from '@/utils/priceFormating';
import { useLogin } from '@/context/LoginContext';
import CredentialModal from '../modal/CredentialModal';
import { useNavigate } from 'react-router-dom';
import { HashLoader } from 'react-spinners';

const ProductVehicleDetail = ({ref_vehicle_id} : {ref_vehicle_id: number}) => {
    const [vehicle, setVehicle] = useState<VehicleRoot>();
    const enviUrl = import.meta.env.VITE_API_BASE_URL;
    const [image, setImage] = useState('');
    const { user } = useLogin();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.post('v1/GetVehicleById', { ref_vehicle_id: ref_vehicle_id });
                setVehicle(response.data);
                setImage(enviUrl + response.data.picture_url);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    },[])

    const checkCredential = (custId: number) => {
        if (!custId || custId === 0) {
            setIsModalOpen(true);
        }
        else {
            navigate('/Customer/VehicleOrderDetail/' + ref_vehicle_id);
        }
    }

    return (
        <div>
            {loading ? (
            <div className="flex justify-center items-center min-h-screen">
                <HashLoader size={50} color={"#123abc"} loading={loading} />
            </div>
        ) : (
            <>
            <div className="flex flex-col sm:w-[10rem] md:w-[40rem] lg:w-[80rem]">
                {/* OrderDetail {ref_vehicle_id}
                <br></br>
                {vehicle?.vehicle.qty} */}
                <label htmlFor="" className='font-bold text-4xl p-6'>{vehicle?.vehicle.vehicle_name}</label>
                <div className="px-6 sm:w-64">
                    {rating(vehicle?.vehicle.rating ?? 0)}
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
                            {vehicle?.vehicle.description}

                        </div>
                        <br />
                        <div className="mt-4">
                            {<DirectionsCarIcon/>} DETAIL
                            <h1>tipe kendaraan : {vehicle?.vehicle.vehicle_type}</h1>
                            <h1>model kendaraan : {vehicle?.vehicle.vehicle_model}</h1>
                            <h1>jumlah kursi : {vehicle?.vehicle.vehicle_seat}</h1>
                        </div>

                        <br />
                        <div className="mt-4">
                            {<RoomIcon/>} LOCATION
                            <br />
                            <h1>DETAIL ADDRESS : {vehicle?.vehicle.address}</h1>
                            <h1>ADDRESS : {vehicle?.address}</h1>
                        </div>

                    </div>

                    {/* kanan */}
                    <div className='flex flex-col px-2'>
                        <h1>HARGA :</h1>
                        <label htmlFor="" className='font-bold text-2xl'>{formatPrice(vehicle?.base_price ?? 0)}</label>
                        <button className='bg-gradient-to-r from-green-300 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white font-bold py-2 px-4 rounded mt-4' onClick={() => checkCredential(user?.customer_id ?? 0)}>Order</button>
                    </div>
                </div>
            </div>
            <CredentialModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </>
        )}
        </div>
    )
}

export default ProductVehicleDetail

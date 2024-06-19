import axiosClient from '@/axios.client';
import { useEffect, useState } from 'react'
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
import { useTranslation } from 'react-i18next';
import geocodeAddress, { Coordinates } from '@/components/ui/Custom/maps/geocodeAddress';
import MapComponent from '@/components/ui/Custom/maps/MapComponent';

const ProductVehicleDetail = ({ref_vehicle_id} : {ref_vehicle_id: number}) => {
    const [vehicle, setVehicle] = useState<VehicleRoot>();
    const enviUrl = import.meta.env.VITE_API_BASE_URL;
    const [image, setImage] = useState('');
    const { user } = useLogin();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [position, setPosition] = useState<Coordinates | null>(null);
    //const [addr, setAddr] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.post('v1/GetVehicleById', { ref_vehicle_id: ref_vehicle_id });
                setVehicle(response.data);
                setImage(enviUrl + response.data.picture_url);

                const parts = response.data.address_zipcode.split(',');
                const wordAfterSecondComma = parts.length >= 3 ? parts[2].trim() : null;
                //setAddr(wordAfterSecondComma);
                const coords = await geocodeAddress(wordAfterSecondComma);
                setPosition(coords);

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
                    <div className='flex flex-col xl:min-w-[58rem] lg:min-w-[40rem] sm:min-w-[35rem] px-4 shadow-lg border-slate-200 border-2 p-6 rounded-lg'>
                        <div className="">
                            <div className='font-bold'>
                                {<DescriptionIcon/>}
                                {t('Description')}
                            </div>
                            {vehicle?.vehicle.description}

                        </div>
                        <br />
                        <div className="mt-4">
                            <div className='font-bold'>
                                {<DirectionsCarIcon/>}
                                {t('Detail')}
                            </div>
                            <h1>{t('Vehicle Type')} : {vehicle?.vehicle.vehicle_type}</h1>
                            <h1>{t('Vehicle Model')} : {vehicle?.vehicle.vehicle_model}</h1>
                            <h1>{t('Vehicle Seat')} : {vehicle?.vehicle.vehicle_seat}</h1>
                        </div>

                        <br />
                        <div className="mt-4">
                            <div className='font-bold'>
                                {<RoomIcon/>}
                                {t('Location')}
                            </div>
                            <h1>{t('Street Address')} : {vehicle?.vehicle.address}</h1>
                            <h1>{t('Address')} : {vehicle?.address_zipcode}</h1>
                            <br />
                            {position ? <MapComponent position={position} /> : <p>Loading map...</p>}
                        </div>

                    </div>

                    {/* kanan */}
                    <div className='flex flex-col px-5'>
                        <h1>{t('Price')} :</h1>
                        <label htmlFor="" className='font-bold text-2xl truncate'>{formatPrice(vehicle?.base_price ?? 0)}</label>
                        <button className='bg-gradient-to-r from-green-300 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white font-bold py-2 px-4 rounded mt-4' onClick={() => checkCredential(user?.customer_id ?? 0)}>{t('Order')}</button>
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

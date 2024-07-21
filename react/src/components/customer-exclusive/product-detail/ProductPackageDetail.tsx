import axiosClient from '@/axios.client';
import { useEffect, useState } from 'react'
import { Attraction, AttractionRoot, Hotel, HotelRoot, Package, Vehicle, VehicleRoot } from '../interface/interface';
import { formatPrice } from '@/utils/priceFormating';
import HashLoader from 'react-spinners/HashLoader';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '@/context/LoginContext';

//icon
import DescriptionIcon from '@mui/icons-material/Description';
import SellIcon from '@mui/icons-material/Sell';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Resizable } from './components/Resizeable';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import CredentialModal from '../modal/CredentialModal';

const ProductPackageDetail = ({package_h_id} : {package_h_id:number}) => {
    const { t } = useTranslation();
    const { user } = useLogin();

    const [ pack, setPack ] = useState<Package>({} as Package);
    const [hotelData, setHotelData] = useState<HotelRoot[]>([]);
    const [attractionData, setAttractionData] = useState<AttractionRoot[]>([]);
    const [vehicleData, setVehicleData] = useState<VehicleRoot[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();
    const enviUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.post('v1/GetPackageDataById', { package_h_id: package_h_id });
                const packageData = response.data.data;
                setPack(response.data.data);

                if (response.data.data) {
                    // hotel
                    const hotelPromises = packageData.package_ds
                    .filter((d:Hotel) => d.ref_hotel_id !== null)
                    .map((d:Hotel) => axiosClient.post('v1/GetHotelById', { ref_hotel_id: d.ref_hotel_id }));

                    const hotelResponses = await Promise.all(hotelPromises);
                    setHotelData(hotelResponses.map(res => res.data));

                    // attraction
                    const attractionPromises = packageData.package_ds
                    .filter((d:Attraction) => d.ref_attraction_id !== null)
                    .map((d:Attraction) => axiosClient.post('v1/GetAttractionById', { ref_attraction_id: d.ref_attraction_id }));

                    const attractionResponses = await Promise.all(attractionPromises);
                    setAttractionData(attractionResponses.map(res => res.data));

                    // vehicle
                    const vehiclePromises = packageData.package_ds
                    .filter((d:Vehicle) => d.ref_vehicle_id !== null)
                    .map((d:Vehicle) => axiosClient.post('v1/GetVehicleById', { ref_vehicle_id: d.ref_vehicle_id }));

                    const vehicleResponses = await Promise.all(vehiclePromises);
                    setVehicleData(vehicleResponses.map(res => res.data));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally{
                setLoading(false);
            }
        }

        fetchData();
    },[package_h_id])

    const checkCredential = (custId: number) => {
        if (!custId || custId === 0) {
            setIsModalOpen(true);
        }
        else {
            navigate('/Customer/PackageOrderDetail/' + package_h_id);
        }
    }

    return (
        <div className='min-h-[42rem]'>
            {loading ? (
            <div className="flex justify-center items-center min-h-screen">
                <HashLoader size={50} color={"#123abc"} loading={loading} />
            </div>
            ) : (
                <div className="shadow-xl lg:w-[80rem] mt-16 min-h-72 p-24 space-y-8">
                    <div className="text-2xl bg-blue-500 w-max p-2 rounded-lg text-white flex flex-row space-x-4 px-12">
                        <p>{pack.package_name}</p>
                    </div>

                    <Resizable hotelPic={hotelData[0]?.picture_url} attractionPic={attractionData[0]?.picture_url} vehiclePic={vehicleData[0]?.picture_url}/>

                    <div className="flex flex-row space-x-8">
                        <div className="w-[36rem] space-y-2">
                            <h2 className="text-xl">{t('Hotel')}</h2>
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                {hotelData.map((hotel, index) => (
                                    <div key={index}>
                                        <p>{hotel.hotel.hotel_name}</p>
                                    </div>
                                ))}
                            </div>

                            <h2 className="text-xl">{t('Attraction')}</h2>
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                {attractionData.map((attraction, index) => (
                                    <div key={index}>
                                        <p>{attraction.attraction.attraction_name}</p>
                                    </div>
                                ))}
                            </div>

                            <h2 className="text-xl">{t('Vehicle')}</h2>
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                {vehicleData.map((vehicle, index) => (
                                    <div key={index}>
                                        <p>{vehicle.vehicle.vehicle_name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 w-full flex flex-col ">
                            <div className="space-y-4 bg-blue-100 p-4 rounded-lg max-w-2xl">
                                <div className="flex flex-row">
                                    <DescriptionIcon className='text-blue-700'/>
                                    <p className='text-blue-800'>{t('Description')}</p>
                                </div>
                                <p className='text-white-800'>{pack.description}</p>
                            </div>
                            <div className="flex flex-col space-y-4 bg-blue-100 p-4 rounded-lg max-w-2xl">
                                <div className="flex flex-row space-x-4">
                                    <SellIcon className='text-blue-700'/>
                                    <p>{formatPrice(pack.package_price)}</p>
                                </div>
                                <div className="flex flex-row space-x-4">
                                    <CalendarTodayIcon className='text-blue-700'/>
                                    <p>{pack.total_days} {t('days')}</p>
                                </div>
                            </div>
                            <div className="flex justify-end p-6">
                                <Button className='max-w-36 w-full bg-gradient-to-r from-green-300 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white font-bold py-2 px-4 rounded'
                                    onClick={() => checkCredential(user?.customer_id ?? 0)}>
                                    {t('Order')}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <CredentialModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                </div>
            )}
        </div>
    )
}

export default ProductPackageDetail

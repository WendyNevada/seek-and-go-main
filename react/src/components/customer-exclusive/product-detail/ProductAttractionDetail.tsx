import { useEffect, useState } from 'react'
import { AttractionRoot } from '../interface/interface';
import axiosClient from '@/axios.client';
import rating from '@/components/ui/Custom/rating';

// icon
import DescriptionIcon from '@mui/icons-material/Description';
import RoomIcon from '@mui/icons-material/Room';

// public utils
import { formatPrice } from '@/utils/priceFormating';
import { useNavigate } from 'react-router-dom';
import HashLoader from 'react-spinners/HashLoader';
import CredentialModal from '../modal/CredentialModal';
import { useLogin } from '@/context/LoginContext';
import { useTranslation } from 'react-i18next';
import geocodeAddress, { Coordinates } from '@/components/ui/Custom/maps/geocodeAddress';
import MapComponent from '@/components/ui/Custom/maps/MapComponent';

const ProductAttractionDetail = ({ref_attraction_id} : {ref_attraction_id: number}) => {
    const [attraction, setAttraction] = useState<AttractionRoot>();
    const enviUrl = import.meta.env.VITE_API_BASE_URL;
    const [image, setImage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { user } = useLogin();
    const { t } = useTranslation();
    const [position, setPosition] = useState<Coordinates | null>(null);
    // const [addr, setAddr] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.post('v1/GetAttractionById', { ref_attraction_id: ref_attraction_id });
                setAttraction(response.data);
                setImage(enviUrl + response.data.picture_url);

                const parts = response.data.address_zipcode.split(',');
                const wordAfterSecondComma = parts.length >= 3 ? parts[2].trim() : null;
                // setAddr(wordAfterSecondComma);
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
            navigate('/Customer/AttractionOrderDetail/' + ref_attraction_id);
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
            <label htmlFor="" className='font-bold text-4xl p-6'>{attraction?.attraction.attraction_name}</label>
            <div className="px-6 sm:w-64">
                {rating(attraction?.attraction.rating ?? 0)}
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
                        {attraction?.attraction.description}

                    </div>

                    <br />
                    <div className="mt-4">
                        <div className='font-bold'>
                            {<RoomIcon/>}
                            {t('Location')}
                        </div>
                        <h1>{t('Street Address')} : {attraction?.attraction.address}</h1>
                        <h1>{t('Address')} : {attraction?.address_zipcode}</h1>
                        <br />
                        {position ? <MapComponent position={position} /> : <p>Loading map...</p>}
                    </div>

                </div>

                {/* kanan */}
                <div className='flex flex-col px-5'>
                    <h1>{t('Price')} :</h1>
                    <label htmlFor="" className='font-bold text-2xl truncate'> {formatPrice(attraction?.base_price ?? 0)}</label>
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

export default ProductAttractionDetail

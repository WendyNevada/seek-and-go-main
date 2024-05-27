import HotelOrderDetail from '@/components/customer-exclusive/order/HotelOrderDetail';
import Footer from '@/components/navbar/Footer';
import Navbar from '@/components/navbar/Navbar';
import { useParams } from 'react-router-dom';

const HotelOrderDetailPage = () => {
    const {ref_hotel_id} = useParams();
    return (
        <div>
            <Navbar/>
                <div className="flex mt-[7rem] lg:mt-[6rem]  items-center sm:justify-start xl:justify-center">
                    <HotelOrderDetail ref_hotel_id={Number(ref_hotel_id) || 0}/>
                </div>
            <Footer/>
        </div>
    )
}

export default HotelOrderDetailPage

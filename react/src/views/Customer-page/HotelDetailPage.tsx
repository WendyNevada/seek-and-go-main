import ProductHotelDetail from '@/components/customer-exclusive/product-detail/ProductHotelDetail';
import Footer from '@/components/navbar/Footer';
import Navbar from '@/components/navbar/Navbar';
import { useParams } from 'react-router-dom';

const HotelDetailPage = () => {
    const {ref_hotel_id} = useParams();

    return (
        <div className="">
            <Navbar/>
                <div className="flex mt-[7rem] lg:mt-[6rem] items-center sm:justify-start xl:justify-center">
                    <ProductHotelDetail ref_hotel_id={Number(ref_hotel_id) || 0}/>
                </div>
            <Footer/>
        </div>

    )
}

export default HotelDetailPage

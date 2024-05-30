import ProductAttractionDetail from '@/components/customer-exclusive/product-detail/ProductAttractionDetail';
import Footer from '@/components/navbar/Footer';
import Navbar from '@/components/navbar/Navbar';
import { useParams } from 'react-router-dom';

const AttractionDetailPage = () => {
    const {ref_attraction_id} = useParams();

  return (
    <div className="">
        <Navbar/>
            <div className="flex mt-[7rem] lg:mt-[6rem]  items-center sm:justify-start xl:justify-center">
                <ProductAttractionDetail ref_attraction_id={Number(ref_attraction_id) || 0}/>
            </div>
        <Footer/>
    </div>
  )
}

export default AttractionDetailPage

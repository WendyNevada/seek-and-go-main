import ProductVehicleDetail from '@/components/customer-exclusive/product-detail/ProductVehicleDetail'
import Footer from '@/components/navbar/Footer'
import Navbar from '@/components/navbar/Navbar'
import { useParams } from 'react-router-dom'

const VehicleDetailPage = () => {
    const {ref_vehicle_id} = useParams();

  return (
    <div>
        <Navbar/>
            <div className="flex mt-[7rem] lg:mt-[6rem]  items-center sm:justify-start xl:justify-center">
                <ProductVehicleDetail ref_vehicle_id={Number(ref_vehicle_id) || 0}/>
            </div>
        <Footer/>
    </div>
  )
}

export default VehicleDetailPage

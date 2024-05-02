import OrderDetail from '@/components/customer-exclusive/order-detail/OrderDetail'
import Footer from '@/components/navbar/Footer'
import Navbar from '@/components/navbar/Navbar'
import React from 'react'
import { useParams } from 'react-router-dom'

const VehicleDetailPage = () => {
    const {ref_vehicle_id} = useParams();

  return (
    // // <div>
    // {/* //     <Navbar/>
    // //         <div className="max-w-xs mt-[7rem] lg:mt-[6rem]">
    // //             <OrderDetail ref_vehicle_id={Number(ref_vehicle_id) || 0}/>
    // //         </div>
    // //     <Footer/>
    // // </div> */}
    <div>
        <Navbar/>
            <div className="flex mt-[7rem] lg:mt-[6rem] justify-center items-center">
                <OrderDetail ref_vehicle_id={Number(ref_vehicle_id) || 0}/>
            </div>
        <Footer/>
    </div>
  )
}

export default VehicleDetailPage

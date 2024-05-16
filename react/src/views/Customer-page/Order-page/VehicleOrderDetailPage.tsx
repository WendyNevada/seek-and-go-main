import VehicleOrderDetail from '@/components/customer-exclusive/order/VehicleOrderDetail';
import Footer from '@/components/navbar/Footer';
import Navbar from '@/components/navbar/Navbar';
import React from 'react'
import { useParams } from 'react-router-dom';

const VehicleOrderDetailPage = () => {
    const {ref_vehicle_id} = useParams();
    return (
        <div>
            <Navbar/>
                <div className="mt-[7rem] lg:mt-[6rem] items-center sm:justify-center xl:justify-center mx-80 px-28">
                    <VehicleOrderDetail ref_vehicle_id={Number(ref_vehicle_id) || 0}/>
                </div>
            <Footer/>
        </div>
    )
}

export default VehicleOrderDetailPage

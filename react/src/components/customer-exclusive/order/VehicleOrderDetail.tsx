import React, { useEffect } from 'react'
import { VehicleRoot } from '../interface/interface';
import axiosClient from '@/axios.client';

const VehicleOrderDetail = ({ref_vehicle_id} : {ref_vehicle_id: number}) => {
    const [vehicle, setVehicle] = React.useState<VehicleRoot>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.post('v1/GetVehicleById', { ref_vehicle_id: ref_vehicle_id });
                setVehicle(response.data);
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    },[ref_vehicle_id])

    return (
        <div className="flex flex-col space-y-8 px-6 py-2">
            <div className="px-6 py-12 bg-red-200 border-0 shadow-lg sm:rounded-3xl">
                VehicleOrderDetail
            </div>
            <div className="bg-yellow-200">
                tes
                {vehicle?.vehicle.vehicle_name}
            </div>
        </div>
    )
}

export default VehicleOrderDetail

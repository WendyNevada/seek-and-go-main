import EditVehicle from '@/components/agency-exclusive/add-vehicle/EditVehicle'
import AgencyNavbar from '@/components/navbar/AgencyNavbar'
import React from 'react'
import { useParams } from 'react-router-dom'

const AgencyEditVehiclePage = () => {
    const { ref_vehicle_id } = useParams();
    return (
        <div>
            <AgencyNavbar/>
            <div className="text-3xl mt-20">
                <EditVehicle ref_vehicle_id={Number(ref_vehicle_id) || 0}/>
            </div>
        </div>
    )
}

export default AgencyEditVehiclePage

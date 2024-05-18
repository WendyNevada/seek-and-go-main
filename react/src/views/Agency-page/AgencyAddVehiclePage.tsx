import AddVehicle from '@/components/agency-exclusive/add-vehicle/AddVehicle'
import AgencyNavbar from '@/components/navbar/AgencyNavbar'
import React from 'react'

const AgencyAddVehiclePage = () => {
  return (
    <div>
        <AgencyNavbar/>
        <div className="text-3xl mt-20">
            <AddVehicle/>
        </div>
    </div>
  )
}

export default AgencyAddVehiclePage

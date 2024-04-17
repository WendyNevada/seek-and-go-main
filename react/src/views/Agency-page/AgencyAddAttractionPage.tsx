import AddAttraction from '@/components/agency-exclusive/add-attraction/AddAttraction'
import AgencyNavbar from '@/components/navbar/AgencyNavbar'
import React from 'react'

const AgencyAddAttractionPage = () => {
  return (
    <div>
        <AgencyNavbar/>
        <div className="text-3xl mt-20">
            <AddAttraction/>
        </div>

    </div>
  )
}

export default AgencyAddAttractionPage

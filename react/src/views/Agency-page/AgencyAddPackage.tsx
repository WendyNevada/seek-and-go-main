import AddPackage from '@/components/agency-exclusive/add-package/AddPackage'
import AgencyNavbar from '@/components/navbar/AgencyNavbar'
import React from 'react'

const AgencyAddPackage = () => {
  return (
    <div>
        <AgencyNavbar/>
        <div className="text-3xl mt-20">
            <AddPackage/>
        </div>
    </div>
  )
}

export default AgencyAddPackage

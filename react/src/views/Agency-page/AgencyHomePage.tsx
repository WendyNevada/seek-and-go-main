import AgencyAccordion from '@/components/agency-exclusive/main-dashboard/AgencyAccordion'
import AgencyDashboard from '@/components/agency-exclusive/main-dashboard/AgencyDashboard'
import AgencyNavbar from '@/components/navbar/AgencyNavbar'
import React from 'react'

const AgencyHomePage = () => {
  return (
    <div>
        <AgencyNavbar />
        <div className="inset-x-0 mx-auto max-w-2xl mt-40 sm:mt-40 md:mt-40">
                {/* Centered container */}
                <div className="min-w-28">
                    <AgencyDashboard />
                </div>
        </div>
        <div className="my-20 mx-40">
            <AgencyAccordion />
        </div>
    </div>



  )
}

export default AgencyHomePage

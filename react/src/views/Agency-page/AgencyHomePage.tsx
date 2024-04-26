import AgencyDashboard from '@/components/agency-exclusive/main-dashboard/AgencyDashboard'
import AgencyNavbar from '@/components/navbar/AgencyNavbar'
import React from 'react'

const AgencyHomePage = () => {
  return (
    <div>
        <AgencyNavbar/>
        <h1 className='text-3xl mt-60'>Agency Home Page</h1>
        <AgencyDashboard/>
    </div>
  )
}

export default AgencyHomePage

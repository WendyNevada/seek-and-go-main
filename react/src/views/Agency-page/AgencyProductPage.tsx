
import ProductList from '@/components/agency-exclusive/product-dashboard/ProductList'
import AgencyNavbar from '@/components/navbar/AgencyNavbar'
import React from 'react'

const AgencyProductPage = () => {
  return (
    <div>
        <AgencyNavbar/>
        <div className='min-w-28 mt-40 sm:mt-40 md:mt-40 max-w-screen-lg sm:mx-80 mb-10'>
            <ProductList/>
        </div>
    </div>
  )
}

export default AgencyProductPage

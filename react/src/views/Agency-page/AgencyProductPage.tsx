
import ProductList from '@/components/agency-exclusive/product-dashboard/ProductList'
import AgencyNavbar from '@/components/navbar/AgencyNavbar'
import React from 'react'

const AgencyProductPage = () => {
  return (
    <div>
        <AgencyNavbar/>
        <div className='min-w-28 mt-40 mt-20 sm:mt-40 md:mt-40 mx-auto max-w-screen-lg'>
            <ProductList/>
        </div>
    </div>
  )
}

export default AgencyProductPage

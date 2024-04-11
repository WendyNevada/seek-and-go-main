
import ProductList from '@/components/agency-exclusive/product/ProductList'
import AgencyNavbar from '@/components/navbar/AgencyNavbar'
import React from 'react'

const AgencyProductPage = () => {
  return (
    <div>
        <AgencyNavbar/>
        <div className='mt-40 mr-60 ml-60'>
            <ProductList/>
        </div>
    </div>
  )
}

export default AgencyProductPage

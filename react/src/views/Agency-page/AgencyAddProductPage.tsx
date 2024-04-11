import AddProduct from '@/components/agency-exclusive/add-product/AddProduct'
import AgencyNavbar from '@/components/navbar/AgencyNavbar'
import React from 'react'

const AgencyAddProductPage = () => {
  return (
    <div>
        <AgencyNavbar/>
        <div className="text-3xl mt-60">
            <AddProduct/>
        </div>
    </div>
  )
}

export default AgencyAddProductPage

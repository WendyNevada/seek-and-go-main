import CustomPackageCustomer from '@/components/customer-exclusive/custom-package-customer/CustomPackageCustomer'
import Footer from '@/components/navbar/Footer'
import Navbar from '@/components/navbar/Navbar'

const CustomPackageCustomerPage = () => {
  return (
    <div>
        <Navbar/>
        Custom Package
        <div className='flex mt-[7rem] lg:mt-[6rem]  items-center sm:justify-start xl:justify-center'>
            <CustomPackageCustomer/>
        </div>
        <Footer/>
    </div>
  )
}

export default CustomPackageCustomerPage
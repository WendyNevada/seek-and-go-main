import CustomPackageCustomerDetail from '@/components/customer-exclusive/custom-package-customer/CustomPackageCustomerDetail';
import Navbar from '@/components/navbar/Navbar';
import { useParams } from 'react-router-dom';

const CustomPackageCustomerDetailPage = () => {
    const { package_h_id } = useParams();
    
  return (
    <div>
        <Navbar/>
        <div className='min-w-28 mt-40 sm:mt-40 md:mt-40 max-w-screen-xl sm:mx-80'>
            <CustomPackageCustomerDetail package_h_id={Number(package_h_id) || 0}/>
        </div>
    </div>
  )
}

export default CustomPackageCustomerDetailPage
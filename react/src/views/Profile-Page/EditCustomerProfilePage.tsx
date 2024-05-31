import EditProfileCustomer from '@/components/customer-exclusive/customer-profile/EditProfileCustomer';
import Footer from '@/components/navbar/Footer';
import Navbar from '@/components/navbar/Navbar';
import { useParams } from 'react-router-dom';

const EditCustomerProfilePage = () => {
  
  const {account_id} = useParams();

  return (
    <div>
            <Navbar/>
                <div className="flex mt-[7rem] lg:mt-[6rem] items-center sm:justify-start xl:justify-center">
                    <EditProfileCustomer account_id={Number(account_id) || 0}/>
                </div>
            <Footer/>
        </div>
  )
}

export default EditCustomerProfilePage

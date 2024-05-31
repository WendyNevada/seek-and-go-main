import EditProfileAgency from '@/components/agency-exclusive/agency-profile/EditProfileAgency'
import Navbar from '@/components/navbar/AgencyNavbar'
import Footer from '@/components/navbar/Footer'
import { useParams } from 'react-router-dom';

const EditAgencyProfilePage = () => {
    const {account_id} = useParams();

    return (
        <div>
            <Navbar/>
                <div className="flex mt-[7rem] lg:mt-[6rem] items-center sm:justify-start xl:justify-center">
                    <EditProfileAgency account_id={Number(account_id) || 0}/>
                </div>
            <Footer/>
        </div>
    )
}

export default EditAgencyProfilePage

import ForgotPasswordForm from '@/components/forget-password/ForgotPasswordForm'
import Footer from '@/components/navbar/Footer';
import Navbar from '@/components/navbar/Navbar';
import { useParams } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const {account_id} = useParams();
  return (
    <div>
        <Navbar/>
            <div className="flex mt-[7rem] lg:mt-[6rem]  items-center sm:justify-start xl:justify-center">
                <ForgotPasswordForm account_id={Number(account_id) || 0}/>
            </div>
        <Footer/>
    </div>
  )
}

export default ForgotPasswordPage
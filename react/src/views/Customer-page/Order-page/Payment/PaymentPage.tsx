import PaymentDetail from '@/components/customer-exclusive/payment/paymentDetail'
import Footer from '@/components/navbar/Footer'
import Navbar from '@/components/navbar/Navbar'
import { useParams } from 'react-router-dom';

const PaymentPage = () => {
    const {order_h_id} = useParams();

  return (
    <div>
        <Navbar/>
            <div className="flex mt-[7rem] lg:mt-[6rem]  items-center sm:justify-start xl:justify-center">
                <PaymentDetail order_h_id={Number(order_h_id) || 0}/>
            </div>
        <Footer/>
    </div>
  )
}

export default PaymentPage

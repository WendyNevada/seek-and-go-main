import MyOrder from '@/components/customer-exclusive/my-order/MyOrder';
import Footer from '@/components/navbar/Footer';
import Navbar from '@/components/navbar/Navbar';
import { useParams } from 'react-router-dom'

const MyOrderPage = () => {
    const {customer_id} = useParams();

    return (
        <div>
            <Navbar/>
                <div className="flex mt-[7rem] lg:mt-[6rem]  items-center sm:justify-start xl:justify-center">
                    <MyOrder customer_id={Number(customer_id) || 0}/>
                </div>
            <Footer/>
        </div>
    )
}

export default MyOrderPage

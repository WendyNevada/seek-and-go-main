import MyOrderDetail from "@/components/customer-exclusive/my-order/MyOrderDetail.tsx/MyOrderDetail"
import Footer from "@/components/navbar/Footer"
import Navbar from "@/components/navbar/Navbar"
import { useParams } from "react-router-dom";

const MyOrderDetailPage = () => {
    const {order_h_id} = useParams();

    return (
        <div>
            <Navbar/>
                <div className="min-w-28 mt-40 sm:mt-40 md:mt-40 max-w-screen-xl sm:mx-80">
                    <MyOrderDetail order_h_id={Number(order_h_id) || 0}/>
                </div>
            <Footer/>
        </div>
  )
}

export default MyOrderDetailPage

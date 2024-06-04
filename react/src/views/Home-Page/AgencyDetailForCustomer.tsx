import AgencyView from "@/components/home/Agency/AgencyView";
import Footer from "@/components/navbar/Footer";
import Navbar from "@/components/navbar/Navbar";
import { useParams } from "react-router-dom"


const AgencyDetailForCustomer = () => {
    const {agency_id} = useParams();

    return (
        <div>
            <Navbar/>
            <div className="flex mt-[7rem] lg:mt-[6rem] items-center sm:justify-start xl:justify-center">
                <AgencyView agency_id={Number(agency_id) || 0}/>
            </div>
            <Footer/>
        </div>
    )
}

export default AgencyDetailForCustomer

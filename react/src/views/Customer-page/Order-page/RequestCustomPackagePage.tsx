import RequestPackage from "@/components/home/Agency/CustomPackage/RequestPackage";
import Footer from "@/components/navbar/Footer";
import Navbar from "@/components/navbar/Navbar";
import { useParams } from "react-router-dom"

const RequestCustomPackagePage = () => {
    const { agency_id } = useParams();

    return (
        <div>
            <Navbar/>
                <div className="mt-[7rem] lg:mt-[6rem] items-center sm:justify-center xl:justify-center max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 min-h-[41rem]">
                    <RequestPackage agency_id={Number(agency_id) || 0}/>
                </div>
            <Footer/>
        </div>
    )
}

export default RequestCustomPackagePage

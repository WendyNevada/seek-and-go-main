import axiosClient from "@/axios.client";
import { AgencyData } from "@/components/customer-exclusive/interface/interface";
import { useEffect, useState } from "react";
import HashLoader from "react-spinners/HashLoader";
import PackageListForCust from "./ProductList/PackageListForCust";
import VehicleListForCust from "./ProductList/VehicleListForCust";
import HotelListForCust from "./ProductList/HotelListForCust";
import AttractionListForCust from "./ProductList/AttractionListForCust";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import CredentialModal from "@/components/customer-exclusive/modal/CredentialModal";
import { useLogin } from "@/context/LoginContext";
import { useTranslation } from "react-i18next";

const AgencyView = ({agency_id}: {agency_id:number}) => {
    const [agency, setAgency] = useState<AgencyData>();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useLogin();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.post('v1/GetAgencyByAgencyId', { agency_id: agency_id });
                console.log(response.data);
                setAgency(response.data.data);
            } catch (error) {
                console.error(error);
            }finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [agency_id]);

    const requestCustomPackage = ( id : number) => {
        if ( user?.customer_id == null || user?.customer_id === 0) {
            setIsModalOpen(true);
        }
        else{
            navigate(`/Customer/RequestCustomPackage/${id}`);
        }
    }

    return (
        <div className="flex flex-col space-y-8 px-6 py-2 min-h-[40rem]">
            {loading ? (
            <div className="flex justify-center items-center min-h-screen">
                <HashLoader size={50} color={"#123abc"} loading={loading} />
            </div>
            ) : (
                <div className="mt-16 min-h-72 space-y-8">
                    <div className="text-2xl lg:w-[80rem] bg-blue-800 p-2 rounded-3xl text-white flex flex-col px-12 py-6 align-start items-start space-y-8">
                        <div className="flex flex-col">
                            <p className="font-bold">{agency?.agency_name}</p>
                            <p className="font-bold">{agency?.location}</p>
                        </div>
                        <div className="flex">
                            <Button className="bg-white hover:bg-blue-700 text-blue-800 hover:text-white" onClick={() => requestCustomPackage(agency?.agency_id || 0)}>{t('Request Custom Package')}</Button>
                        </div>
                    </div>

                    <div className="border-2 border-slate-100 w-full rounded-xl p-6">
                        <p className="text-4xl">{t('Package')}</p>
                        <PackageListForCust agency_id={agency_id}/>
                    </div>

                    <div className="border-2 border-slate-100 w-full rounded-xl p-6">
                        <p className="text-4xl">{t('Vehicle')}</p>
                        <VehicleListForCust agency_id={agency_id}/>
                    </div>

                    <div className="border-2 border-slate-100 w-full rounded-xl p-6">
                        <p className="text-4xl">{t('Hotel')}</p>
                        <HotelListForCust agency_id={agency_id}/>
                    </div>

                    <div className="border-2 border-slate-100 w-full rounded-xl p-6">
                        <p className="text-4xl">{t('Attraction')}</p>
                        <AttractionListForCust agency_id={agency_id}/>
                    </div>

                    <CredentialModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                </div>
            )}
        </div>
    )
}

export default AgencyView

import { useLogin } from "@/context/LoginContext";
import { urlConstant } from "@/urlConstant";
import { useEffect, useState } from "react";
import { AgencyData, AttractionRoot } from "../interface/interface";
import geocodeAddress, { Coordinates } from "@/components/ui/Custom/maps/geocodeAddress";
import { useNavigate } from "react-router-dom";
import axiosClient from "@/axios.client";
import HashLoader from "react-spinners/HashLoader";
import { RangeDatePicker } from "./component/RangeDatePicker";
import AddDayQty from "./component/AddDayQty";
import { formatPrice } from "@/utils/priceFormating";
import MapComponent from "@/components/ui/Custom/maps/MapComponent";
import { Button } from "@/components/ui/button";
import PriceBox from "./component/PriceBox";
import rating from "@/components/ui/Custom/rating";
import { useTranslation } from "react-i18next";


const AttractionOrderDetail = ({ref_attraction_id} : {ref_attraction_id: number}) => {
  useLogin(urlConstant.AttractionOrderDetail + '/' + ref_attraction_id);
    const [attraction, setAttraction] = useState<AttractionRoot>();
    const [agency, setAgency] = useState<AgencyData>();
    const [qty, setQty] = useState(0);
    const [loading, setLoading] = useState(true);
    const enviUrl = import.meta.env.VITE_API_BASE_URL;
    const [position, setPosition] = useState<Coordinates | null>(null);
    const [addr, setAddr] = useState<string>('');
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.post('v1/GetAttractionById', { ref_attraction_id: ref_attraction_id });
                setAttraction(response.data);
                const parts = response.data.address_zipcode.split(',');
                const wordAfterSecondComma = parts.length >= 3 ? parts[2].trim() : null;

                if(response.data !== null){
                    const response2 = await axiosClient.post('v1/GetAgencyByAgencyId', { agency_id: response.data.agency_id });
                    setAgency(response2.data.data);
                    setAddr(wordAfterSecondComma);
                    const coords = await geocodeAddress(wordAfterSecondComma);
                    setPosition(coords);
                }
            } catch (error) {
                console.error(error);
            }finally {
                setLoading(false);
            }
        }
        fetchData();
    },[ref_attraction_id])

    const setQtyDay = (num: number) => {
        if (qty + num >= 0) {
            setQty(qty + num);
        }
    }

    const onConfirm = () => {
        navigate('/Customer/PaymentDetail/' + ref_attraction_id);
    }

  return (
    <div className="flex flex-col space-y-8 px-6 py-2">
        {loading ? (
            <div className="flex justify-center items-center min-h-screen">
                <HashLoader size={50} color={"#123abc"} loading={loading} />
            </div>
        ) : (
            <>
                <div className="px-6 py-4 border-2 shadow-lg sm:rounded-xl border-slate-100">
                <p className='text-xl font-bold'>{attraction?.attraction.attraction_name}</p>
            </div>
            <div className="flex flex-row space-x-8">
                <div className="shadow-lg border-2 border-slate-100 w-[55rem]">
                    <div className="flex flex-row p-6">
                        <img className='rounded-xl w-[20rem]' src={enviUrl + attraction?.picture_url} alt="" />
                        <div className="flex flex-col px-4">
                            <p>{t('Description')} : {attraction?.attraction.description}</p>
                            <p>{t('Rating')} : {rating(attraction?.attraction.rating ?? 0)} ({attraction?.attraction.rating ?? 0})</p>
                            {/* <p>Price : {formatPrice(vehicle?.base_price || 0)}</p> */}

                        </div>
                    </div>
                    <div className="shadow-lg border-1 rounded-xl p-6 m-4 bg-slate-100 space-y-2">
                        <p>{t('Pick The Dates')}</p>
                        <div className="flex flex-row space-x-4 items-center">
                            <RangeDatePicker/>
                        </div>
                        <p>{t('Total Days')}</p>
                        <AddDayQty qty={qty} setQtyDay={setQtyDay}/>
                    </div>
                    <div className="shadow-lg border-1 rounded-xl p-6 m-4 bg-slate-100 space-y-2">
                        <p>{addr}</p>
                        {position ? <MapComponent position={position} /> : <p>Loading map...</p>}
                    </div>
                    <div className="shadow-lg border-1 rounded-xl p-6 m-4 bg-slate-100 space-y-2">
                    <p>{t('Price')}</p>
                        <p className='font-semibold text-blue-400'>{formatPrice((attraction?.base_price || 0)*qty)}</p>
                    </div>
                    <div className="m-4 my-10 space-y-2">
                      <Button className="w-40 bg-blue-500 hover:bg-blue-300" onClick={onConfirm}>{t('Confirm')}</Button>
                    </div>
                </div>


                <div className="">
                    <div className="shadow-lg border-slate-100 border-2 p-6 w-72">
                        <p>{t('Agency')}</p>
                        <p className='font-semibold'>{agency?.agency_name}</p>
                        <p>{t('Agency Location')}</p>
                        <p className='font-semibold'>{agency?.location}</p>
                    </div>
                    <div className="shadow-lg border-slate-100 border-2 p-6 w-72 my-5">
                        <PriceBox price={attraction?.base_price || 0} qty={qty} totalPrice={(attraction?.base_price || 0)*qty}/>
                    </div>
                </div>
            </div>
            </>
        )}
        </div>
  )
}

export default AttractionOrderDetail

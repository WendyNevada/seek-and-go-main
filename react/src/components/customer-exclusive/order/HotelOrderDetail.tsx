import { useLogin } from "@/context/LoginContext";
import { AgencyData, HotelRoot } from "../interface/interface";
import { useEffect, useState } from "react";
import geocodeAddress, { Coordinates } from "@/components/ui/Custom/maps/geocodeAddress";
import { useNavigate } from "react-router-dom";
import axiosClient from "@/axios.client";
import { urlConstant } from "@/urlConstant";
import HashLoader from "react-spinners/HashLoader";
import rating from "@/components/ui/Custom/rating";
import AddDayQty from "./component/AddDayQty";
import { formatPrice } from "@/utils/priceFormating";
import MapComponent from "@/components/ui/Custom/maps/MapComponent";
import { Button } from "@/components/ui/button";
import PriceBox from "./component/PriceBox";
import { RangeDatePicker } from "./component/RangeDatePicker";
import { useTranslation } from "react-i18next";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { toast } from "@/components/ui/use-toast";

const HotelOrderDetail = ({ref_hotel_id} : {ref_hotel_id: number}) => {
    const [hotel, setHotel] = useState<HotelRoot>();
    const [agency, setAgency] = useState<AgencyData>();
    const [qty, setQty] = useState(0);
    const [loading, setLoading] = useState(true);
    const enviUrl = import.meta.env.VITE_API_BASE_URL;
    const [position, setPosition] = useState<Coordinates | null>(null);
    const [addr, setAddr] = useState<string>('');
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [ startDt, setStartDt ] = useState('');
    const [ endDt, setEndDt ] = useState('');
    const { user } = useLogin();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.post('v1/GetHotelById', { ref_hotel_id: ref_hotel_id });
                setHotel(response.data);
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
    },[ref_hotel_id])

    // const setQtyDay = (num: number) => {
    //     if (qty + num >= 0) {
    //         setQty(qty + num);
    //     }
    // }

    const handleDateChange = (date: DateRange | undefined) => {
        if (date) {
            setStartDt(date.from ? date.from.toISOString().split('T')[0] : '');
            setEndDt(date.to ? date.to.toISOString().split('T')[0] : '');
        } else {
            setStartDt('');
            setEndDt('');
        }
    };

    const handleQtyChange = (newQty: number) => {
        setQty((newQty - 1) <= 0 ? 0 : (newQty - 1));
        if (startDt && endDt) {
            const newEndDate = addDays(new Date(startDt), newQty - 1);
            setEndDt(newEndDate.toISOString().split('T')[0]);
        }
    };

    const onConfirm = async() => {
        const merged_values = {
            agency_id: agency?.agency_id, 
            customer_id: user?.customer_id, 
            order_dt: new Date().toISOString().split('T')[0],
            details: [{
                package_h_id: null,
                ref_hotel_id: ref_hotel_id,
                ref_attraction_id: null,
                ref_vehicle_id: null,
                start_dt: startDt,
                end_dt: endDt,
                price: hotel?.base_price || 0,
                qty: qty,
                product_type: 'hotel'
            }]
        };

        try {
            const response = await axiosClient.post("/v1/CreateOrder", merged_values, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                toast({
                    variant: "success",
                    description: response.data.message
                });

                navigate('/Customer/MyOrderDetail/' + response.data.order_h_id);
            } else {
                toast({
                    variant: "destructive",
                    description: response.data.message
                });
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                description: error.message
            });
        }
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
                <p className='text-xl font-bold'>{hotel?.hotel.hotel_name}</p>
            </div>
            <div className="flex flex-row space-x-8">
                <div className="shadow-lg border-2 border-slate-100 w-[55rem]">
                    <div className="flex flex-row p-6">
                        <img className='rounded-xl w-[20rem]' src={enviUrl + hotel?.picture_url} alt="" />
                        <div className="flex flex-col px-4">
                            <p>{t('Description')} : {hotel?.hotel.description}</p>
                            <p>{t('Rating')} : {rating(hotel?.hotel.rating ?? 0)} ({hotel?.hotel.rating ?? 0})</p>
                            <p>{t('QTY')} : {hotel?.hotel.qty}</p>
                            {/* <p>Price : {formatPrice(vehicle?.base_price || 0)}</p> */}

                        </div>
                    </div>
                    <div className="shadow-lg border-1 rounded-xl p-6 m-4 bg-slate-100 space-y-2">
                        <p>
                            {t('Pick The Dates')} {t('(these are the check-in and check-out dates)')}
                            <span className="text-red-500 ml-2">*</span>
                        </p>
                        <div className="flex flex-row space-x-4 items-center">
                            <RangeDatePicker 
                                onDateChange={handleDateChange} 
                                onQtyChange={handleQtyChange} 
                                startDt={startDt} 
                                endDt={endDt}
                            />
                        </div>
                        <p>{t('Total Night(s)')}</p>
                        {/* <AddDayQty qty={qty} setQtyDay={setQtyDay}/> */}
                        <h1>{qty}</h1>
                    </div>
                    {/* <div className="shadow-lg border-1 rounded-xl p-6 m-4 bg-slate-100 space-y-2">
                        <p>{addr}</p>
                        {position ? <MapComponent position={position} /> : <p>Loading map...</p>}
                    </div> */}
                    <div className="shadow-lg border-1 rounded-xl p-6 m-4 bg-slate-100 space-y-2">
                        <p>{t('Price')} :</p>
                        <p className='font-semibold text-blue-400'>{formatPrice((hotel?.base_price || 0)*(qty))}</p>
                    </div>
                    {/* <div className="m-4 my-10 space-y-2">
                        <Button className="w-40 bg-blue-500 hover:bg-blue-300" onClick={onConfirm}>{t('Confirm')}</Button>
                    </div> */}
                </div>


                <div className="">
                    <div className="shadow-lg border-slate-100 border-2 p-6 w-72">
                        <p>{t('Agency')}</p>
                        <p className='font-semibold'>{agency?.agency_name}</p>
                        <p>{t('Agency Location')}</p>
                        <p className='font-semibold'>{agency?.location}</p>
                    </div>
                    <div className="shadow-lg border-slate-100 border-2 p-6 w-72 my-5">
                        <PriceBox price={hotel?.base_price || 0} qty={qty} totalPrice={(hotel?.base_price || 0)*(qty)}/>
                        <br />
                        <Button className="w-full bg-blue-500 hover:bg-blue-300" onClick={onConfirm} disabled={!startDt || !endDt}>{t('Confirm')}</Button>
                    </div>
                </div>
            </div>
            </>
        )}
        </div>
    )
}

export default HotelOrderDetail

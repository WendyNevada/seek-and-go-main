import { useLogin } from "@/context/LoginContext";
import { AgencyData, HotelRoot } from "../interface/interface";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "@/axios.client";
import HashLoader from "react-spinners/HashLoader";
import rating from "@/components/ui/Custom/rating";
import { formatPrice } from "@/utils/priceFormating";
import { Button } from "@/components/ui/button";
import PriceBox from "./component/PriceBox";
import { RangeDatePicker } from "./component/RangeDatePicker";
import { useTranslation } from "react-i18next";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

const HotelOrderDetail = ({ref_hotel_id} : {ref_hotel_id: number}) => {
    const [hotel, setHotel] = useState<HotelRoot>();
    const [agency, setAgency] = useState<AgencyData>();
    const [qty, setQty] = useState(0);
    const [loading, setLoading] = useState(true);
    const enviUrl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [ startDt, setStartDt ] = useState('');
    const [ endDt, setEndDt ] = useState('');
    const { user } = useLogin();
    const [ promoCode, setPromoCode ] = useState('');
    const [ newPrice, setNewPrice ] = useState(0);
    const [ priceDeduced, setPriceDeduced ] = useState<number>();
    const [ isClicked, setIsClicked ] = useState(false);
    const [ loadingPromo, setLoadingPromo ] = useState(false);
    const [ unitPromoPrice, setUnitPromoPrice ] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.post('v1/GetHotelById', { ref_hotel_id: ref_hotel_id });
                setHotel(response.data);

                if(response.data !== null){
                    const response2 = await axiosClient.post('v1/GetAgencyByAgencyId', { agency_id: response.data.agency_id });
                    setAgency(response2.data.data);
                }
            } catch (error) {
                console.error(error);
            }finally {
                setLoading(false);
            }
        }
        fetchData();
    },[ref_hotel_id])

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
        if(unitPromoPrice != 0)
        {
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
                    price: unitPromoPrice || 0,
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

                    const merged_values_promo = {
                        id: ref_hotel_id,
                        customer_id: user?.customer_id,
                        promo_code: promoCode,
                        qty: qty
                    }

                    await axiosClient.post('v1/AddPromoCounterHistory',  merged_values_promo,  {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

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
        else
        {
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
    }

    //use effect untuk promo code
    useEffect(() => {
        if(promoCode.length > 0 && isClicked) {
            if(qty)
            {
                setPriceDeduced(0);
                setNewPrice(0);
                setIsClicked(false);
                setUnitPromoPrice(0);
            }
        }
    }, [qty]);

    const onApplyPromo = async() => {
        if(qty != 0)
        {
            const merged_values = {
                id: ref_hotel_id,
                customer_id: user?.customer_id,
                promo_code: promoCode,
                qty: qty
            }

            try {
                setLoadingPromo(true);

                const response = await axiosClient.post("/v1/GetPromoDeductionPriceHotel", merged_values, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.data.status === "ok") {
                    toast({
                        variant: "success",
                        description: response.data.message
                    });

                    setNewPrice(response.data.new_price);
                    setPriceDeduced(response.data.price_deduced);
                    setIsClicked(true);
                    setLoadingPromo(false);
                    setUnitPromoPrice(response.data.price_reduced_per_unit);
                } else {
                    toast({
                        variant: "destructive",
                        description: response.data.message
                    });

                    setPriceDeduced(0);
                    setNewPrice(0);
                    setIsClicked(false);
                    setLoadingPromo(false);
                    setUnitPromoPrice(0);
                }
            } catch (error: any) {
                toast({
                    variant: "destructive",
                    description: error.message
                });
            }
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

                        </div>
                    </div>
                    <div className="shadow-lg border-1 rounded-xl p-6 m-4 bg-slate-100 space-y-2">
                        <p>
                            {t('Pick The Date')} {t('(these are the check-in and check-out dates)')}
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
                    <div className="shadow-lg border-1 rounded-xl p-6 m-4 bg-slate-100 space-y-2">
                        <p>{t('Full Price')} :</p>
                        <p className='font-semibold text-blue-400'>{formatPrice((hotel?.base_price || 0)*(qty))}</p>
                    </div>
                </div>


                <div className="">
                    <div className="shadow-lg border-slate-100 border-2 p-6 w-72">
                        <p>{t('Agency')}</p>
                        <p className='font-semibold'>{agency?.agency_name}</p>
                        <p>{t('Agency Location')}</p>
                        <p className='font-semibold'>{agency?.location}</p>
                    </div>

                    <div className="shadow-lg border-slate-100 border-2 p-6 w-72 space-y-4">
                        <p>{t('Got A Promo Code?')}</p>
                        <div className="">
                            <Input placeholder={t('Enter Promo Code')} onChange={(e) => setPromoCode(e.target.value)}></Input>
                        </div>
                        <div className="flex justify-center items-center">
                            <Button className="bg-blue-500 hover:bg-blue-300" onClick={onApplyPromo} disabled={!promoCode}>{t('Apply')}</Button>
                        </div>
                    </div>

                    <div className="shadow-lg border-slate-100 border-2 p-6 w-72 my-5">
                            {loadingPromo? (
                            <div className="flex flex-row justify-center items-center h-40">
                                <HashLoader size={50} color={"#123abc"} loading={loadingPromo} />
                            </div>
                            ) : (
                            <>
                            <PriceBox price={hotel?.base_price || 0} qty={qty} totalPrice={(hotel?.base_price || 0)*(qty)} priceDeduced={priceDeduced || undefined} newPrice={newPrice || undefined}/>
                            <br />
                            <Button className="w-full bg-blue-500 hover:bg-blue-300" onClick={onConfirm} disabled={!startDt || !endDt || (startDt == endDt)}>{t('Confirm')}</Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            </>
        )}
        </div>
    )
}

export default HotelOrderDetail

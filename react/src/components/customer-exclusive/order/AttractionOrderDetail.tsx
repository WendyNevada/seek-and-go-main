import { useLogin } from "@/context/LoginContext";
import { useEffect, useState } from "react";
import { AgencyData, AttractionRoot } from "../interface/interface";
import { useNavigate } from "react-router-dom";
import axiosClient from "@/axios.client";
import HashLoader from "react-spinners/HashLoader";
import AddDayQty from "./component/AddDayQty";
import { formatPrice } from "@/utils/priceFormating";
import { Button } from "@/components/ui/button";
import PriceBox from "./component/PriceBox";
import rating from "@/components/ui/Custom/rating";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

const AttractionOrderDetail = ({ ref_attraction_id }: { ref_attraction_id: number }) => {
    const [attraction, setAttraction] = useState<AttractionRoot>();
    const [agency, setAgency] = useState<AgencyData>();
    const [qty, setQty] = useState(0);
    const [loading, setLoading] = useState(true);
    const enviUrl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useLogin();
    const [ startDt, setStartDt ] = React.useState<Date>();
    const [ promoCode, setPromoCode ] = useState('');
    const [ newPrice, setNewPrice ] = useState(0);
    const [ priceDeduced, setPriceDeduced ] = useState<number>();
    const [ isClicked, setIsClicked ] = useState(false);
    const [ loadingPromo, setLoadingPromo ] = useState(false);
    const [ unitPromoPrice, setUnitPromoPrice ] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.post('v1/GetAttractionById', { ref_attraction_id: ref_attraction_id });
                setAttraction(response.data);

                if(response.data !== null){
                    const response2 = await axiosClient.post('v1/GetAgencyByAgencyId', { agency_id: response.data.agency_id });
                    setAgency(response2.data.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [ref_attraction_id]);

    const setQtyDay = (num: number) => {
        const newQty = qty + num;
        if (newQty >= 0 && newQty <= (attraction?.attraction.qty ?? Infinity)) {
            setQty(newQty);
        } else if (newQty < 0) {
            setQty(0);
        } else {
            setQty(attraction?.attraction.qty ?? 0);
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
                    ref_hotel_id: null,
                    ref_attraction_id: ref_attraction_id,
                    ref_vehicle_id: null,
                    start_dt: startDt?.toISOString().split('T')[0],
                    end_dt: startDt?.toISOString().split('T')[0], //attraction hanya pake 1 tanggal
                    price: unitPromoPrice,
                    qty: qty,
                    product_type: 'attraction'
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
                        id: ref_attraction_id,
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
                    ref_hotel_id: null,
                    ref_attraction_id: ref_attraction_id,
                    ref_vehicle_id: null,
                    start_dt: startDt?.toISOString().split('T')[0],
                    end_dt: startDt?.toISOString().split('T')[0], //attraction hanya pake 1 tanggal
                    price: attraction?.base_price || 0,
                    qty: qty,
                    product_type: 'attraction'
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
    };
    

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
                id: ref_attraction_id,
                customer_id: user?.customer_id,
                promo_code: promoCode,
                qty: qty
            }
    
            try {
                setLoadingPromo(true);

                const response = await axiosClient.post("/v1/GetPromoDeductionPriceAttraction", merged_values, {
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
                        <p className='text-xl font-bold'>{attraction?.attraction.attraction_name}</p>
                    </div>

                    <div className="flex flex-row space-x-8">
                        <div className="shadow-lg border-2 border-slate-100 w-[55rem]">
                            <div className="flex flex-row p-6">
                                <img className='rounded-xl w-[20rem]' src={enviUrl + attraction?.picture_url} alt="" />
                                <div className="flex flex-col px-4">
                                    <p>{t('Description')} : {attraction?.attraction.description}</p>
                                    <p>{t('Rating')} : {rating(attraction?.attraction.rating ?? 0)} ({attraction?.attraction.rating ?? 0})</p>
                                    <p>{t('QTY')} : {attraction?.attraction.qty}</p>
                                </div>
                            </div>

                            <div className="shadow-lg border-1 rounded-xl p-6 m-4 bg-slate-100 space-y-2">
                                <p>
                                    {t('Pick The Date')}
                                    <span className="text-red-500 ml-2">*</span>
                                </p>
                                <div className="flex flex-row space-x-4 items-center">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[280px] justify-start text-left font-normal",
                                                !startDt && "text-muted-foreground"
                                            )}
                                            >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {startDt ? format(startDt, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                            mode="single"
                                            selected={startDt}
                                            onSelect={setStartDt}
                                            initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <p>
                                    {t('Total Ticket(s)')}
                                    <span className="text-red-500 ml-2">*</span>
                                </p>
                                <AddDayQty qty={qty} setQtyDay={setQtyDay} 
                                    // onQtyChange={handleQtyChange} 
                                />
                            </div>

                            <div className="shadow-lg border-1 rounded-xl p-6 m-4 bg-slate-100 space-y-2">
                                <p>{t('Full Price')}</p>
                                <p className='font-semibold text-blue-400'>{formatPrice((attraction?.base_price || 0) * qty)}</p>
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
                                    <PriceBox price={attraction?.base_price || 0} qty={qty} totalPrice={(attraction?.base_price || 0) * qty } priceDeduced={priceDeduced || undefined} newPrice={newPrice || undefined}/>
                                    <br />
                                    <Button className="w-full bg-blue-500 hover:bg-blue-300" onClick={onConfirm} disabled={!startDt || !qty}>{t('Confirm')}</Button>
                                </>
                                )}
                            </div>
                        </div>

                    </div>
                </>
            )}
        </div>
    );
};

export default AttractionOrderDetail;

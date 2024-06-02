import { useLogin } from "@/context/LoginContext";
import { urlConstant } from "@/urlConstant";
import { useEffect, useState } from "react";
import { AgencyData, AgencyPayment, AttractionRoot } from "../interface/interface";
import { useNavigate } from "react-router-dom";
import axiosClient from "@/axios.client";
import HashLoader from "react-spinners/HashLoader";
import AddDayQty from "./component/AddDayQty";
import { formatPrice } from "@/utils/priceFormating";
import { Button } from "@/components/ui/button";
import PriceBox from "./component/PriceBox";
import rating from "@/components/ui/Custom/rating";
import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { hitAddApi } from "@/context/HitApi";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
import { toast } from "@/components/ui/use-toast";

const AttractionOrderDetail = ({ ref_attraction_id }: { ref_attraction_id: number }) => {
    useLogin(urlConstant.AttractionOrderDetail + '/' + ref_attraction_id);
    const [attraction, setAttraction] = useState<AttractionRoot>();
    const [agency, setAgency] = useState<AgencyData>();
    const [agencyPayment, setAgencyPayment] = useState<AgencyPayment[]>();
    const [qty, setQty] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedPaymentType, setSelectedPaymentType] = useState<string | null>(null);
    const [selectedBank, setSelectedBank] = useState<string | null>(null);
    const enviUrl = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useLogin();
    const [ startDt, setStartDt ] = React.useState<Date>();
    //const [ endDt, setEndDt ] = useState('');
    const [ agencyPaymentId, setAgencyPaymentId ] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.post('v1/GetAttractionById', { ref_attraction_id: ref_attraction_id });
                setAttraction(response.data);

                if(response.data !== null){
                    const response2 = await axiosClient.post('v1/GetAgencyByAgencyId', { agency_id: response.data.agency_id });
                    setAgency(response2.data.data);

                    const responsePayment = await axiosClient.post('v1/GetAllAgencyPaymentByAgencyId', { agency_id: response.data.agency_id });
                    setAgencyPayment(responsePayment.data.data);
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

    // const handleDateChange = (date: DateRange | undefined) => {
    //     if (date) {
    //         setStartDt(date.from ? date.from.toISOString().split('T')[0] : '');
    //         setEndDt(date.to ? date.to.toISOString().split('T')[0] : '');
    //     } else {
    //         setStartDt('');
    //         setEndDt('');
    //     }
    // };

    const onConfirm = async() => {
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
                price: attraction?.base_price || 0 * qty,
                qty: qty,
                product_type: 'attraction'
            }]
        };

        const response = await axiosClient.post("/v1/CreateOrder", merged_values, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        if(response.status === 200)
        {
            toast({
                variant: "success",
                description: response.data.message
            });

            //navigate('/Customer/PaymentDetail/' + response.data.order_h_id + '/' + agencyPaymentId);
            navigate('/');
        }
        else
        {
            toast({
                variant: "destructive",
                description: response.data.message
            });
        }
    };

    //const filteredAgencyPayments = agencyPayment?.filter(payment => payment.payment_type === selectedPaymentType);

    // const handleQtyChange = (newQty: number) => {
    //     setQty(newQty);
    //     if (startDt && endDt) {
    //         const newEndDate = addDays(new Date(startDt), newQty - 1);
    //         setEndDt(newEndDate.toISOString().split('T')[0]);
    //     }
    // };


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
                                    {/* <RangeDatePicker onDateChange={handleDateChange} onQtyChange={handleQtyChange} startDt={startDt} endDt={endDt} /> */}
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

                            {/* <div className="shadow-lg border-1 rounded-xl p-6 m-4 bg-slate-100 space-y-2">
                                <p>{t('Payment Methods')}</p>
                                <Select onValueChange={(value) => { 
                                    setSelectedPaymentType(value); 
                                    setSelectedBank(null);
                                }}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder={t('Payment Type')}>{selectedPaymentType ?? t('Payment Type')}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Bank Transfer">{t('Bank Transfer')}</SelectItem>
                                        <SelectItem value="QRIS">{t('QRIS')}</SelectItem>
                                    </SelectContent>
                                </Select>
                                
                                <p>{t('Select Bank')}</p>
                                <Select 
                                    value={selectedBank ?? undefined} 
                                    onValueChange={(value) => {
                                        setSelectedBank(value);
                                        const selectedPayment = filteredAgencyPayments?.find(payment => 
                                            `${payment.bank_name} - ${payment.account_name}` === value
                                        );
                                        setAgencyPaymentId(selectedPayment?.agency_payment_id ?? 0);
                                    }}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder={t('Select Bank')}>{selectedBank ?? t('Select Bank')}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredAgencyPayments?.map((agencyPaymentItem) => (
                                            <SelectItem 
                                                key={agencyPaymentItem.agency_payment_id} 
                                                value={`${agencyPaymentItem.bank_name} - ${agencyPaymentItem.account_name}`}>
                                                {agencyPaymentItem.bank_name} - {agencyPaymentItem.account_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div> */}

                            <div className="shadow-lg border-1 rounded-xl p-6 m-4 bg-slate-100 space-y-2">
                                <p>{t('Price')}</p>
                                <p className='font-semibold text-blue-400'>{formatPrice((attraction?.base_price || 0) * qty)}</p>
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
                                <PriceBox price={attraction?.base_price || 0} qty={qty} totalPrice={(attraction?.base_price || 0) * qty}/>
                                <br />
                                <Button className="w-full bg-blue-500 hover:bg-blue-300" onClick={onConfirm} disabled={!startDt || !qty}>{t('Confirm')}</Button>

                            </div>
                        </div>

                    </div>
                </>
            )}
        </div>
    );
};

export default AttractionOrderDetail;

import axiosClient from "@/axios.client"
import { useEffect, useState } from "react"
import { Attraction, AttractionRoot, Hotel, HotelRoot, OrderData, Package, Vehicle, VehicleRoot } from "../interface/interface";
import HashLoader from "react-spinners/HashLoader";
import { useTranslation } from "react-i18next";
import { formatPrice } from "@/utils/priceFormating";
import rating from "@/components/ui/Custom/rating";
import { DatePicker } from "./component/DatePicker";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useLogin } from "@/context/LoginContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { toInteger } from "lodash";


const PackageOrderDetail = ({package_h_id} : {package_h_id:number}) => {
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();
    const enviUrl = import.meta.env.VITE_API_BASE_URL;
    const { user } = useLogin();
    const navigate = useNavigate();

    const [ pack, setPack ] = useState<Package>({} as Package);
    const [hotelData, setHotelData] = useState<HotelRoot[]>([]);
    const [attractionData, setAttractionData] = useState<AttractionRoot[]>([]);
    const [vehicleData, setVehicleData] = useState<VehicleRoot[]>([]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    //const [endDate, setEndDate] = useState<Date | null>(null);
    const [ ord ,setOrd ] = useState<OrderData>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.post('v1/GetPackageDataById', { package_h_id: package_h_id });
                const packageData = response.data.data;
                setPack(response.data.data);

                if (response.data.data) {
                    // hotel
                    const hotelPromises = packageData.package_ds
                    .filter((d:Hotel) => d.ref_hotel_id !== null)
                    .map((d:Hotel) => axiosClient.post('v1/GetHotelById', { ref_hotel_id: d.ref_hotel_id }));

                    const hotelResponses = await Promise.all(hotelPromises);
                    setHotelData(hotelResponses.map(res => res.data));

                    // attraction
                    const attractionPromises = packageData.package_ds
                    .filter((d:Attraction) => d.ref_attraction_id !== null)
                    .map((d:Attraction) => axiosClient.post('v1/GetAttractionById', { ref_attraction_id: d.ref_attraction_id }));

                    const attractionResponses = await Promise.all(attractionPromises);
                    setAttractionData(attractionResponses.map(res => res.data));

                    // vehicle
                    const vehiclePromises = packageData.package_ds
                    .filter((d:Vehicle) => d.ref_vehicle_id !== null)
                    .map((d:Vehicle) => axiosClient.post('v1/GetVehicleById', { ref_vehicle_id: d.ref_vehicle_id }));

                    const vehicleResponses = await Promise.all(vehiclePromises);
                    setVehicleData(vehicleResponses.map(res => res.data));
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    },[package_h_id])

    const addDays = (date: Date, days: number): Date => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };

    const handleDateChange = (date: Date) => {
        setStartDate(date);
        if (pack.total_days) {
            const days = toInteger(pack.total_days);
            const endDt = addDays(date, days);

            //setEndDate(endDt);

            // Update pack state with start_dt and end_dt for each PackageD
            const updatedPack = {
                agency_id : pack.agency_id,
                order_dt : format(new Date(), 'yyyy-MM-dd'),
                customer_id: user?.customer_id ?? 0, // Include customer_id
                details: pack.package_ds.map(d => ({
                    package_h_id: package_h_id,
                    ref_hotel_id: d.ref_hotel_id ?? null,
                    ref_attraction_id: d.ref_attraction_id ?? null,
                    ref_vehicle_id: d.ref_vehicle_id ?? null,
                    start_dt: format(date, 'yyyy-MM-dd'),
                    end_dt: format(endDt, 'yyyy-MM-dd'),
                    price: pack.package_price,
                    qty: 1,//karena paket
                    product_type: 'package'
                }))
            };

            setOrd(updatedPack);
        }
    };

    const onConfirm = async() => {
        try {
            const response = await axiosClient.post('v1/CreateOrder', ord , {
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
            }
            else {
                toast({
                    variant: "destructive",
                    description: response.data.message
                });
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="flex flex-col space-y-8 px-6 py-2 min-h-[40rem]">
            {loading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <HashLoader size={50} color={"#123abc"} loading={loading} />
                </div>
            ) : (
                <>
                    <div className="bg-blue-800 text-white px-6 py-2 rounded-xl">
                        <p className="text-3xl">{pack.package_name}</p>
                    </div>

                    <div className="flex flex-row space-x-8">
                        <div className="shadow-lg border-2 border-slate-100 w-full rounded-xl">
                            <div className="flex flex-col p-6">

                                <div className="flex flex-row">
                                    <div className="">
                                        {t('Total Days')}
                                        <br />
                                        {t('Price')}
                                        <br />
                                        {t('QTY')}
                                        <br />
                                        {t('Description')}
                                    </div>
                                    <div className="ml-4">
                                        : {pack.total_days}
                                        <br />
                                        : {formatPrice(pack.package_price)}
                                        <br />
                                        : {pack.qty}
                                        <br />
                                        : {pack.description}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row space-y-full">
                        <div className="w-[50rem] space-y-2 m-8">
                            <div className="bg-blue-800 text-white px-6 py-2 rounded-lg max-w-[10rem] flex justify-center">
                                <p>{t('Package Detail')}</p>
                            </div>

                            <h2 className="text-xl m">Hotels</h2>
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                {hotelData.map((hotel, index) => (
                                    <div key={index}>
                                        <p className="font-bold">{hotel.hotel.hotel_name}</p>
                                        <div className="flex flex-row space-x-4">
                                            <img className="w-[8rem] h-[6rem] rounded-xl" src={enviUrl + hotel.picture_url} alt="" />
                                            <div className="flex flex-col">

                                                <div className="flex flex-row">
                                                    <div>
                                                        {t('Rating')}
                                                    </div>
                                                    <div className="ml-4">
                                                        : {rating(hotel?.hotel.rating ?? 0)} ({hotel?.hotel.rating ?? 0})
                                                    </div>
                                                </div>

                                                <div className="flex flex-row">
                                                    <div>
                                                        {t('Description')}
                                                    </div>
                                                    <div className="ml-4 text-justify">
                                                        : {hotel.hotel.description}
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <h2 className="text-xl">Attraction</h2>
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                {attractionData.map((attraction, index) => (
                                    <div key={index}>
                                        <p className="font-bold">{attraction.attraction.attraction_name}</p>
                                        <div className="flex flex-row space-x-4">
                                            <img className="w-[8rem] h-[6rem] rounded-xl" src={enviUrl + attraction.picture_url} alt="" />
                                            <div className="flex flex-col">

                                                <div className="flex flex-row">
                                                    <div>
                                                        {t('Rating')}
                                                    </div>
                                                    <div className="ml-4">
                                                        : {rating(attraction?.attraction.rating ?? 0)} ({attraction?.attraction.rating ?? 0})
                                                    </div>
                                                </div>

                                                <div className="flex flex-row">
                                                    <div>
                                                        {t('Description')}
                                                    </div>
                                                    <div className="ml-4 text-justify">
                                                        : {attraction.attraction.description}
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <h2 className="text-xl">Vehicle</h2>
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                {vehicleData.map((vehicle, index) => (
                                    <div key={index} className="space-y-2">
                                        <p className="font-bold">{vehicle.vehicle.vehicle_name}</p>
                                        <div className="flex flex-row space-x-4">
                                            <img className="w-[8rem] h-[6rem] rounded-xl" src={enviUrl + vehicle.picture_url} alt="" />
                                            <div className="flex flex-col">

                                                <div className="flex flex-row">
                                                    <div>
                                                        {t('Rating')}
                                                    </div>
                                                    <div className="ml-4">
                                                        : {rating(vehicle?.vehicle.rating ?? 0)} ({vehicle?.vehicle.rating ?? 0})
                                                    </div>
                                                </div>

                                                <div className="flex flex-row">
                                                    <div>
                                                        {t('Description')}
                                                    </div>
                                                    <div className="ml-4 text-justify">
                                                        : {vehicle.vehicle.description}
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex w-[30rem] h-[30rem] justify-start p-10 border-2 border-slate-100 rounded-xl">
                            <div className="p-4 space-y-16">
                                <div className="space-y-2">
                                    <p>{t('Pick The Date')} {t('(This is the starting date)')}</p>
                                    <DatePicker onDateChange={handleDateChange}/>
                                </div>
                                <Button className="w-full bg-blue-500 hover:bg-blue-300" disabled={startDate === null} onClick={onConfirm}>{t('Confirm')}</Button>
                            </div>
                        </div>
                    </div>


                </>
            )}
        </div>
    )
}

export default PackageOrderDetail

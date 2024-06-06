import { DaumVehicle } from "@/components/agency-exclusive/product-dashboard/utils/ProductModel";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import rating from "@/components/ui/Custom/rating";
import axiosClient from "@/axios.client";

const VehicleListForCust = ({agency_id} : {agency_id: number}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const enviUrl = import.meta.env.VITE_API_BASE_URL;
    const [vehicle, setVehicle] = useState<DaumVehicle[]>([]);

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const response = await axiosClient.post('/v1/GetActiveVehicleByAgencyId', {
                    agency_id: agency_id
                });
                setVehicle(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchVehicle();
    },[]);

    const selectItem = (id : number) => {
        navigate(`/Customer/VehicleDetail/${id}`);
    }

    return (
        <div>
           {loading ? (
            <div className="flex justify-center items-center min-h-screen">
                <HashLoader size={50} color={"#123abc"} loading={loading} />
            </div>
            ) : (
                vehicle.reduce((rows: JSX.Element[][], vehicle, index) => {
                    if (index % 4 === 0) {
                        rows.push([]);
                    }
                    rows[rows.length - 1].push(
                        <div key={vehicle.ref_vehicle_id} className='flex-1'>
                            <Card className='w-64 shadow-lg mt-10 mr-16 hover:cursor-pointer' onClick={() => selectItem(vehicle.ref_vehicle_id)}>
                                <img src={enviUrl + vehicle.image_url} alt={vehicle.vehicle_name} className="h-36 w-full shadow-lg" />
                                <CardHeader>
                                    <CardTitle className='w-[200px] truncate'>{vehicle.vehicle_name}</CardTitle>
                                    <CardDescription>{vehicle.description}</CardDescription>
                                </CardHeader>
                                <CardContent className='flex-1'>
                                    <p>{vehicle.address}</p>
                                    <div className="flex flex-row align-middle">
                                        {rating(vehicle.rating)}
                                        {vehicle.rating ? vehicle.rating : 0}
                                    </div>
                                    <p>{t('Price')}: Rp.{vehicle.base_price}</p>
                                </CardContent>
                                <CardFooter>
                                    {/* <Button variant='primary' onClick={() => onEditVehicle(vehicle.ref_vehicle_id)}>{<EditIcon />}</Button>
                                    <AlertDialogProduct apiPath='/v1/DeactivateVehicleById' Id={vehicle.ref_vehicle_id} param='ref_vehicle_id'/> */}
                                </CardFooter>
                            </Card>
                        </div>
                    );
                    return rows;
                }, []).map((row, index) => (
                    <div key={index} className='flex flex-row justify-left w-64'>
                        {row.map((card, i) => (
                            <div key={i} className='flex-1'>
                                {card}
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    )
}

export default VehicleListForCust

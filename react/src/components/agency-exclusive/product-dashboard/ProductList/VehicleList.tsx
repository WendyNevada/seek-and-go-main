import React, { useEffect, useState } from 'react'
import { DaumVehicle } from '../utils/ProductModel'
import { useNavigate } from 'react-router-dom';
import { useLogin } from '@/context/LoginContext';
import axiosClient from '@/axios.client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialogProduct } from '../ProductComponent/DeleteProductAlert';
import EditIcon from '@mui/icons-material/Edit';
import rating from '@/components/ui/Custom/rating';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';

const VehicleList = () => {
    const { t } = useTranslation();
    const [vehicle, setVehicle] = useState<DaumVehicle[]>([]);
    const navigate = useNavigate();
    const { user } = useLogin();
    const enviUrl = import.meta.env.VITE_API_BASE_URL;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const response = await axiosClient.post('/v1/GetActiveVehicleByAgencyId', {
                    agency_id: user?.agency_id
                }); // Replace 'your-api-url' with the actual API endpoint
                setVehicle(response.data.data); // Assuming the response data is an array of vehicles
                setLoading(false);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            }
        }
        fetchVehicle();
    },[]);

    const onEditVehicle = (refVehicleId: number) => {
        //ref_attraction_id
        navigate(`/Agency/EditVehicle/${refVehicleId}`)
    }

    const renderSkeleton = () => (
        <div className="flex flex-col space-y-3 mx-8">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    );

    return (
        <div className='mt-2 justify-left'>
            {loading ? (
                <div className='flex flex-wrap'>
                    {Array(3).fill(0).map((_, index) => (
                        <div key={index} className='flex-1'>
                            {renderSkeleton()}
                        </div>
                    ))}
                </div>
            ) : (
                vehicle.reduce((rows: JSX.Element[][], vehicle, index) => {
                    if (index % 4 === 0) {
                        rows.push([]);
                    }
                    rows[rows.length - 1].push(
                        <div key={vehicle.ref_vehicle_id} className='flex-1'>
                            <Card className='w-64 shadow-lg mt-10 mr-16'>
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
                                    <Button variant='primary' onClick={() => onEditVehicle(vehicle.ref_vehicle_id)}>{<EditIcon />}</Button>
                                    <AlertDialogProduct apiPath='/v1/DeactivateVehicleById' Id={vehicle.ref_vehicle_id} param='ref_vehicle_id'/>
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

export default VehicleList

import React, { useEffect, useState } from 'react'
import { GetVehicleModel } from '../utils/ProductModel'
import { useNavigate } from 'react-router-dom';
import { useLogin } from '@/context/LoginContext';
import axiosClient from '@/axios.client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialogProduct } from '../ProductComponent/DeleteProductAlert';
import EditIcon from '@mui/icons-material/Edit';

const VehicleList = () => {
    const [vehicle, setVehicle] = useState<GetVehicleModel[]>([]);
    const navigate = useNavigate();
    const { user } = useLogin();
    const enviUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const response = await axiosClient.post<GetVehicleModel[]>('/v1/GetActiveVehicleByAgencyId', {
                    agency_id: user?.agency_id
                }); // Replace 'your-api-url' with the actual API endpoint
                setVehicle(response.data); // Assuming the response data is an array of vehicles
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

    return (
        <div className='mt-4 justify-between'>
            {vehicle.reduce((rows: JSX.Element[][], vehicle, index) => {
                if (index % 4 === 0) {
                    rows.push([]);
                }
                rows[rows.length - 1].push(
                    <div key={vehicle.ref_vehicle_id} className='flex-1'>
                        <Card className='w-64 shadow-lg mt-10'>
                        <img src={enviUrl + vehicle.image_url} alt={vehicle.vehicle_name} className="h-36 max-w-full shadow-lg" />
                            <CardHeader>
                                <CardTitle>{vehicle.vehicle_name}</CardTitle>
                                <CardDescription>{vehicle.description}</CardDescription>
                            </CardHeader>
                            <CardContent className='flex-1'>
                                <p>{vehicle.address}</p>
                                <p>{vehicle.rating}</p>
                                <p>Base Price: Rp.{vehicle.base_price}</p>
                            </CardContent>
                            <CardFooter>
                                <Button variant='primary' onClick={() => onEditVehicle(vehicle.ref_vehicle_id)}>{<EditIcon />}</Button>
                                <AlertDialogProduct attractionId={vehicle.ref_vehicle_id} />
                                {/* <Button className='ml-2' variant="destructive">Delete</Button> */}
                            </CardFooter>
                        </Card>
                    </div>
                );
                return rows;
            }, []).map((row, index) => (
                <div key={index} className='flex flex-row'>
                    {row}
                </div>
            ))}
        </div>
    )
}

export default VehicleList

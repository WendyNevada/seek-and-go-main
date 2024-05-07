import axiosClient from "@/axios.client";
import { GetVehicleModel } from "@/components/agency-exclusive/product-dashboard/utils/ProductModel";
import rating from "@/components/ui/Custom/rating";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import {Carousel,CarouselContent,CarouselItem,CarouselNext,CarouselPrevious} from "@/components/ui/carousel"
import { useNavigate } from "react-router-dom";
// import { LoginProvider } from "@/context/LoginContext";

const DisplayVehicle = () => {
    // const { navigatedTo } = LoginProvider();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState<GetVehicleModel>();
    const enviUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const response = await axiosClient.post<GetVehicleModel>('/v1/GetVehicleHomepage'); // Replace 'your-api-url' with the actual API endpoint
                setVehicle(response.data); // Assuming the response data is an array of vehicles
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            }
        }
        fetchVehicle();
    },[])

    const selectItem = (id : number) => {
        console.log('selected id : ',id);
        navigate(`/Customer/VehicleOrderDetail/${id}`);
        //navigateTo(`/vehicle/${id}`);
        //navigatedTo(`/Customer/ProductDetail`);
    }

    return (
        <div className='mt-12 justify-between'>
            <h2 className='text-2xl font-semibold'>Daftar Kendaraan</h2>
            <Carousel opts={{align: "start",}} className="w-full">
                <CarouselContent>
                    {vehicle?.data && vehicle.data.length > 0 ? (
                        vehicle.data.map(item => (
                        <CarouselItem key={item.ref_vehicle_id} className="md:basis-1/2 lg:basis-1/4">
                            <div className='flex-1'>
                                <Card className='w-64 shadow-lg mt-8 hover:shadow-2xl cursor-pointer overflow-hidden' onClick={() => selectItem(item.ref_vehicle_id)}>
                                    <img src={enviUrl + item.image_url} alt={item.vehicle_name} className="h-36 w-full shadow-lg hover:scale-110" />
                                    <CardHeader>
                                        <CardTitle>{item.vehicle_name}</CardTitle>
                                        <CardDescription>{item.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className='flex-1'>
                                        <p>{item.address}</p>
                                        {rating(item.rating)}
                                        <p>Base Price: Rp.{item.base_price}</p>
                                    </CardContent>
                                    <CardFooter className="justify-center">
                                        ====
                                    </CardFooter>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))
                ) : (
                    <p>Loading...</p>
                )}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>

            <hr className='mt-12'></hr>
        </div>
    );
};

export default DisplayVehicle;

import axiosClient from "@/axios.client";
import { GetVehicleModel } from "@/components/agency-exclusive/product-dashboard/utils/ProductModel";
import rating from "@/components/ui/Custom/rating";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import {Carousel,CarouselContent,CarouselItem,CarouselNext,CarouselPrevious} from "@/components/ui/carousel"

const DisplayVehicle = () => {
    const [vehicle, setVehicle] = useState<GetVehicleModel[]>([]);
    const enviUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const response = await axiosClient.post<GetVehicleModel[]>('/v1/GetVehicleHomepage'); // Replace 'your-api-url' with the actual API endpoint
                setVehicle(response.data); // Assuming the response data is an array of vehicles
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            }
        }
        fetchVehicle();
    },[])

    return (
        // <div style={{ backgroundColor: "aquamarine" }}>
        //     Daftar Sewa Kendaraan

        // </div>
        <div className='mt-12 justify-between'>
            <h2 className='text-2xl font-semibold'>Daftar Kendaraan</h2>
            <Carousel opts={{align: "start",}} className="w-full">
                <CarouselContent>
                    {vehicle.map(vehicle => (
                        <CarouselItem key={vehicle.ref_vehicle_id} className="md:basis-1/2 lg:basis-1/4">
                            <div className='flex-1'>
                                <Card className='w-64 shadow-lg mt-8 hover:shadow-2xl cursor-pointer overflow-hidden'>
                                    <img src={enviUrl + vehicle.image_url} alt={vehicle.vehicle_name} className="h-36 w-full shadow-lg hover:scale-110" />
                                    <CardHeader>
                                        <CardTitle>{vehicle.vehicle_name}</CardTitle>
                                        <CardDescription>{vehicle.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className='flex-1'>
                                        <p>{vehicle.address}</p>
                                        {rating(vehicle.rating)}
                                        <p>Base Price: Rp.{vehicle.base_price}</p>
                                    </CardContent>
                                    <CardFooter className="justify-center">
                                        ====
                                    </CardFooter>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>


        </div>
    );
};

export default DisplayVehicle;

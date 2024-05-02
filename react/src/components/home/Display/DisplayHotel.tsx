import axiosClient from '@/axios.client';
import { GetHotelModel } from '@/components/agency-exclusive/product-dashboard/utils/ProductModel'
import rating from '@/components/ui/Custom/rating';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useEffect, useState } from 'react'
import {Carousel,CarouselContent,CarouselItem,CarouselNext,CarouselPrevious} from "@/components/ui/carousel"

const DisplayHotel = () => {
    const [hotel, setHotel] = useState<GetHotelModel[]>([])
    const enviUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const response = await axiosClient.post<GetHotelModel[]>('/v1/GetHotelHomepage'); // Replace 'your-api-url' with the actual API endpoint
                setHotel(response.data); // Assuming the response data is an array of vehicles
            } catch (error) {
                console.error('Error fetching hotels:', error);
            }
        }
        fetchHotel();
    },[])

    return (
        <div className='mt-12 justify-between'>
            <h2 className='text-2xl font-semibold'>Daftar Hotel</h2>
            <Carousel opts={{align: "start",}} className="w-full">
                <CarouselContent>
                    {hotel.map(item => (
                        <CarouselItem key={item.ref_hotel_id} className="md:basis-1/2 lg:basis-1/4">
                            <div className='flex-1'>
                                <Card className='w-64 shadow-lg mt-8 hover:shadow-2xl cursor-pointer overflow-hidden'>
                                    <img src={enviUrl + item.image_url} alt={item.hotel_name} className="h-36 w-full shadow-lg hover:scale-110" />
                                    <CardHeader>
                                        <CardTitle>{item.hotel_name}</CardTitle>
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
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}

export default DisplayHotel

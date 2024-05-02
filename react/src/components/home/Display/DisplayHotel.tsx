import axiosClient from '@/axios.client';
import { GetHotelModel } from '@/components/agency-exclusive/product-dashboard/utils/ProductModel'
import rating from '@/components/ui/Custom/rating';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useEffect, useState } from 'react'

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

            {hotel.reduce((rows: JSX.Element[][], hotel, index) => {
                if (index % 4 === 0) {
                    rows.push([]);
                }
                rows[rows.length - 1].push(
                    <div key={hotel.ref_hotel_id} className='flex-1'>
                        <Card className='w-64 shadow-lg mt-8 hover:shadow-2xl cursor-pointer overflow-hidden'>
                        <img src={enviUrl + hotel.image_url} alt={hotel.hotel_name} className="h-36 w-full shadow-lg hover:scale-110" />
                            <CardHeader>
                                <CardTitle>{hotel.hotel_name}</CardTitle>
                                <CardDescription>{hotel.description}</CardDescription>
                            </CardHeader>
                            <CardContent className='flex-1'>
                                <p>{hotel.address}</p>
                                {/* <p>{hotel.rating}</p> */}
                                {rating(hotel.rating)}
                                <p>Base Price: Rp.{hotel.base_price}</p>
                            </CardContent>
                            <CardFooter className="justify-center">
                                {/* <Button className='ml-2' variant="destructive">Delete</Button> */}
                                ====
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
            <hr className='mt-12'></hr>
        </div>
    )
}

export default DisplayHotel

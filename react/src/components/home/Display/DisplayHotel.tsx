import axiosClient from '@/axios.client';
import { GetHotelModel } from '@/components/agency-exclusive/product-dashboard/utils/ProductModel'
import rating from '@/components/ui/Custom/rating';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react'
import {Carousel,CarouselContent,CarouselItem,CarouselNext,CarouselPrevious} from "@/components/ui/carousel"
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '@/utils/priceFormating';
import { useTranslation } from 'react-i18next';

const DisplayHotel = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [hotel, setHotel] = useState<GetHotelModel>();
    const enviUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const response = await axiosClient.post<GetHotelModel>('/v1/GetHotelHomepage'); // Replace 'your-api-url' with the actual API endpoint
                setHotel(response.data); // Assuming the response data is an array of vehicles
            } catch (error) {
                console.error('Error fetching hotels:', error);
            }
        }
        fetchHotel();
    },[])

    const selectItem = (id : number) => {
        navigate(`/Customer/HotelDetail/${id}`);
        //navigateTo(`/vehicle/${id}`);
        //navigatedTo(`/Customer/ProductDetail`);
    }

    return (
        <div className='mt-12 justify-between'>
            <h2 className='text-2xl font-semibold'>{t('Hotel List')}</h2>
            <Carousel opts={{align: "start",}} className="w-full">
                <CarouselContent>
                    {hotel?.data && hotel.data.length > 0 ? (
                        hotel.data.map(item => (
                            <CarouselItem key={item.ref_hotel_id} className="md:basis-1/2 lg:basis-1/4">
                                <div className='flex-1 mx-4'>
                                    <Card className='w-64 shadow-lg mt-8 hover:shadow-2xl cursor-pointer overflow-hidden' onClick={() => selectItem(item.ref_hotel_id)}>
                                        <img src={enviUrl + item.image_url} alt={item.hotel_name} className="h-36 w-full shadow-lg hover:scale-110" />
                                        <CardHeader>
                                            <CardTitle className='truncate'>{item.hotel_name}</CardTitle>
                                            <CardDescription>{item.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className='flex-1'>
                                            <p className="w-[200px] truncate">{item.address_zipcode}</p>
                                            <p className='font-bold'>{formatPrice(item.base_price ?? 0)}{t(' / Night')}</p>
                                            <p>{item.agency_name}</p>
                                            {rating(item.rating)}
                                        </CardContent>
                                        <CardFooter className="justify-center">
                                            ====
                                        </CardFooter>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))
                    ) : (
                        <div className="flex flex-row justify-center items-center align-middle h-full">
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="flex flex-col space-y-3 mx-8">
                                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-4 w-[200px]" />
                                </div>
                            </div>
                        ))}
                    </div>
                    )}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}

export default DisplayHotel

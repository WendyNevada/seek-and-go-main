import axiosClient from '@/axios.client';
import { GetAttractionModel } from '@/components/agency-exclusive/product-dashboard/utils/ProductModel'
import rating from '@/components/ui/Custom/rating';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useEffect, useState } from 'react'
import {Carousel,CarouselContent,CarouselItem,CarouselNext,CarouselPrevious} from "@/components/ui/carousel"
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '@/utils/priceFormating';
import { useTranslation } from 'react-i18next';

const DisplayAttraction = () => {
    const { t } = useTranslation();

    const navigate = useNavigate();
    const [attraction, setAttractions] = useState<GetAttractionModel>()
    const enviUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchAttraction = async () => {
            try {
                const response = await axiosClient.post<GetAttractionModel>('/v1/GetAttractionHomepage'); // Replace 'your-api-url' with the actual API endpoint
                setAttractions(response.data); // Assuming the response data is an array of vehicles
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            }
        }
        fetchAttraction();
    },[])

    const selectItem = (id : number) => {
        console.log('selected id : ',id);
        navigate(`/Customer/AttractionOrderDetail/${id}`);
    }

    return (
        <div className='mt-12 justify-between'>
            <h2 className='text-2xl font-semibold'>{t('Attraction List')}</h2>

            <Carousel opts={{align: "start",}} className="w-full">
                <CarouselContent>
                    {attraction?.data && attraction.data.length > 0 ? (
                        attraction.data.map(item => (
                        <CarouselItem key={item.ref_attraction_id} className="md:basis-1/2 lg:basis-1/4">
                            <div className='flex-1 mx-4'>
                                <Card className='w-64 shadow-lg mt-8 hover:shadow-2xl cursor-pointer overflow-hidden'  onClick={() => selectItem(item.ref_attraction_id)}>
                                    <img src={enviUrl + item.image_url} alt={item.attraction_name} className="h-36 w-full shadow-lg hover:scale-110" />
                                    <CardHeader>
                                        <CardTitle>{item.attraction_name}</CardTitle>
                                        <CardDescription>{item.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className='flex-1'>
                                        <p>{item.address}</p>
                                        {rating(item.rating)}
                                        <p>{t('Price')}: {formatPrice(item.base_price ?? 0)}</p>
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
            <hr className='mt-12'></hr>
        </div>
    )
}

export default DisplayAttraction

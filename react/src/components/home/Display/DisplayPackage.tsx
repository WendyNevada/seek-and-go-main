import axiosClient from '@/axios.client';
import { Package } from '@/components/agency-exclusive/product-dashboard/utils/ProductModel';
import { useLogin } from '@/context/LoginContext';
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {Carousel,CarouselContent,CarouselItem,CarouselNext,CarouselPrevious} from "@/components/ui/carousel"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/utils/priceFormating';
import rating from '@/components/ui/Custom/rating';

const DisplayPackage = () => {
    const { t } = useTranslation();
    const { user } = useLogin();
    const [packages, setPackages] = useState<Package[]>([]);
    const navigate = useNavigate();

    useEffect( () => {
        const fetchPackage =  async () => {
            try {
                const response = await axiosClient.post('v1/GetAgencyPackagesHomepage');
                console.log(response.data);
                setPackages(response.data.data);
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchPackage();
    }, []);

  return (
    <div className='mt-12 justify-between'>
        <h2 className='text-2xl font-semibold'>{t('Package List')}</h2>
        <Carousel opts={{align: "start",}} className="w-full">
                <CarouselContent>
                    {packages && packages.length > 0 ? (
                        packages.map(item => (
                        <CarouselItem key={item.package_h_id} className="md:basis-1/2 lg:basis-1/4">
                            <div className='flex-1 mx-4'>
                                <Card className='w-64 shadow-lg mt-8 hover:shadow-2xl cursor-pointer overflow-hidden'>
                                    <CardHeader>
                                        <CardTitle>{item.package_name}</CardTitle>
                                        {/* <CardDescription>{item.description}</CardDescription> */}
                                    </CardHeader>
                                    <CardContent className='flex-1'>
                                        <p className="w-[200px] truncate">{item.description}</p>
                                        <p className="font-bold">{formatPrice(item.package_price ?? 0)}</p>
                                        <p>total days : {item.total_days}</p>
                                        {/* {rating(item.rating)} */}
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

export default DisplayPackage
import axiosClient from '@/axios.client';
import { GetAttractionModel } from '@/components/agency-exclusive/product-dashboard/utils/ProductModel'
import rating from '@/components/ui/Custom/rating';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useEffect, useState } from 'react'

const DisplayAttraction = () => {
    const [attraction, setAttractions] = useState<GetAttractionModel[]>([])
    const enviUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchAttraction = async () => {
            try {
                const response = await axiosClient.post<GetAttractionModel[]>('/v1/GetAttractionHomepage'); // Replace 'your-api-url' with the actual API endpoint
                setAttractions(response.data); // Assuming the response data is an array of vehicles
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            }
        }
        fetchAttraction();
    },[])

    return (
        <div className='mt-12 justify-between'>
            <h2 className='text-2xl font-semibold'>Daftar Destinasi Wisata</h2>

            {attraction.reduce((rows: JSX.Element[][], attraction, index) => {
                if (index % 4 === 0) {
                    rows.push([]);
                }
                rows[rows.length - 1].push(
                    <div key={attraction.ref_attraction_id} className='flex-1'>
                        <Card className='w-64 shadow-lg mt-8 hover:shadow-2xl cursor-pointer overflow-hidden'>
                        <img src={enviUrl + attraction.image_url} alt={attraction.attraction_name} className="h-36 w-full shadow-lg hover:scale-110"/>
                            <CardHeader>
                                <CardTitle>{attraction.attraction_name}</CardTitle>
                                <CardDescription>{attraction.description}</CardDescription>
                            </CardHeader>
                            <CardContent className='flex-1'>
                                <p>{attraction.address}</p>
                                {/* <p>{attraction.rating}</p> */}
                                {rating(attraction.rating)}
                                <p>Base Price: Rp.{attraction.base_price}</p>
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

export default DisplayAttraction

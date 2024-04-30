import axiosClient from '@/axios.client';
import { GetAttractionModel } from '@/components/agency-exclusive/product-dashboard/utils/ProductModel'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useEffect, useState } from 'react'

const DisplayAttraction = () => {
    const [attraction, setAttractions] = useState<GetAttractionModel[]>([])
    const enviUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const response = await axiosClient.post<GetAttractionModel[]>('/v1/GetAttractionHomepage'); // Replace 'your-api-url' with the actual API endpoint
                setAttractions(response.data); // Assuming the response data is an array of vehicles
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            }
        }
        fetchVehicle();
    },[])

    return (
        <div className='mt-4 justify-between'>
            <h2>Daftar Destinasi Wisata</h2>

            {attraction.reduce((rows: JSX.Element[][], vehicle, index) => {
                if (index % 4 === 0) {
                    rows.push([]);
                }
                rows[rows.length - 1].push(
                    <div key={vehicle.ref_attraction_id} className='flex-1'>
                        <Card className='w-64 shadow-lg mt-10'>
                        <img src={enviUrl + vehicle.image_url} alt={vehicle.attraction_name} className="h-36 w-full shadow-lg" />
                            <CardHeader>
                                <CardTitle>{vehicle.attraction_name}</CardTitle>
                                <CardDescription>{vehicle.description}</CardDescription>
                            </CardHeader>
                            <CardContent className='flex-1'>
                                <p>{vehicle.address}</p>
                                <p>{vehicle.rating}</p>
                                <p>Base Price: Rp.{vehicle.base_price}</p>
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
        </div>
    )
}

export default DisplayAttraction

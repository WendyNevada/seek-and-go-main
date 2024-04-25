import React, { useEffect, useState } from 'react'
import { GetHotelModel } from '../utils/ProductModel';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '@/context/LoginContext';
import axiosClient from '@/axios.client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialogProduct } from '../ProductComponent/DeleteProductAlert';
import EditIcon from '@mui/icons-material/Edit';
import { urlConstant } from '@/urlConstant';

const HotelList = () => {
    const [hotel, setHotel] = useState<GetHotelModel[]>([]);
    const navigate = useNavigate();

    const { user } = useLogin();
    const enviUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        // Fetch data from the API
        const fetchAttractions = async () => {
            try {
                const response = await axiosClient.post<GetHotelModel[]>('/v1/GetActiveHotelByAgencyId', {
                    agency_id: user?.agency_id
                }); // Replace 'your-api-url' with the actual API endpoint
                setHotel(response.data); // Assuming the response data is an array of attractions
            } catch (error) {
                console.error('Error fetching attractions:', error);
            }
        };
        fetchAttractions();
    }, []);

    const onEdithotel = (refHotelId: number) => {
        //navigate(`/Agency/EditAttraction/${refAttractionId}`)
        navigate(urlConstant.EditHotel + `/${refHotelId}`)
    }

    return (
        <div className='mt-4 justify-between'>
            {hotel.reduce((rows: JSX.Element[][], hotel, index) => {
                if (index % 4 === 0) {
                    rows.push([]);
                }
                rows[rows.length - 1].push(
                    <div key={hotel.ref_hotel_id} className='flex-1'>
                        <Card className='w-64 shadow-lg mt-10'>
                        <img src={enviUrl + hotel.image_url} alt={hotel.hotel_name} className="h-36 w-full shadow-lg" />
                            <CardHeader>
                                <CardTitle>{hotel.hotel_name}</CardTitle>
                                <CardDescription>{hotel.description}</CardDescription>
                            </CardHeader>
                            <CardContent className='flex-1'>
                                <p>{hotel.address}</p>
                                <p>{hotel.rating}</p>
                                <p>Base Price: Rp.{hotel.base_price}</p>
                            </CardContent>
                            <CardFooter>
                                <Button variant='primary' onClick={() => onEdithotel(hotel.ref_hotel_id)}>{<EditIcon />}</Button>
                                <AlertDialogProduct attractionId={hotel.ref_hotel_id} />
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

export default HotelList
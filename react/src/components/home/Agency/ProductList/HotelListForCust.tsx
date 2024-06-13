import axiosClient from "@/axios.client";
import { DaumHotel } from "@/components/agency-exclusive/product-dashboard/utils/ProductModel";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import rating from "@/components/ui/Custom/rating";

const HotelListForCust = ({agency_id} : {agency_id: number}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const enviUrl = import.meta.env.VITE_API_BASE_URL;
    const [hotel, setHotel] = useState<DaumHotel[]>([]);

    useEffect(() => {
        const fetchAttractions = async () => {
            try {
                const response = await axiosClient.post('/v1/GetActiveHotelByAgencyId', {
                    agency_id: agency_id
                });
                setHotel(response.data.data);
            } catch (error) {
                console.error('Error fetching attractions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAttractions();
    }, [])

    const selectItem = (id : number) => {
        navigate(`/Customer/HotelDetail/${id}`);
    }

    return (
        <div>
            {loading ? (
            <div className="flex justify-center items-center min-h-screen">
                <HashLoader size={50} color={"#123abc"} loading={loading} />
            </div>
            ) : (
                hotel.reduce((rows: JSX.Element[][], hotel, index) => {
                    if (index % 4 === 0) {
                        rows.push([]);
                    }
                    rows[rows.length - 1].push(
                        <div key={hotel.ref_hotel_id} className='flex-1'>
                            <Card className='w-64 shadow-lg mt-10 mr-16 hover:cursor-pointer' onClick={() => selectItem(hotel.ref_hotel_id)}>
                            <img src={enviUrl + hotel.image_url} alt={hotel.hotel_name} className="h-36 w-full shadow-lg" />
                                <CardHeader>
                                    <CardTitle className='w-[200px] truncate min-h-8'>{hotel.hotel_name}</CardTitle>
                                    <CardDescription className="truncate">{hotel.description}</CardDescription>
                                </CardHeader>
                                <CardContent className='flex-1'>
                                    <p>{hotel.address}</p>
                                    <div className="flex flex-row  align-middle">
                                        {rating(hotel.rating)}
                                        {hotel.rating ? hotel.rating : 0 }
                                    </div>
                                    <p>{t('Price')}: Rp.{hotel.base_price}</p>
                                </CardContent>
                                <CardFooter>
                                    {/* <Button variant='primary' onClick={() => onEdithotel(hotel.ref_hotel_id)}>{<EditIcon />}</Button>
                                    <AlertDialogProduct apiPath='/v1/DeactivateHotelById' Id={hotel.ref_hotel_id} param='ref_hotel_id'/> */}
                                    {/* <Button className='ml-2' variant="destructive">Delete</Button> */}
                                </CardFooter>
                            </Card>
                        </div>
                    );
                    return rows;
                }, []).map((row, index) => (
                    <div key={index} className='flex flex-row justify-left w-64'>
                        {/* {row} */}
                        {row.map((card, i) => (
                            <div key={i} className='flex-1'>
                                {card}
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    )
}

export default HotelListForCust

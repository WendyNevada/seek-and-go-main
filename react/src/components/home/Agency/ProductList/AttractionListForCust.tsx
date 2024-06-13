import axiosClient from "@/axios.client";
import { DaumAttraction } from "@/components/agency-exclusive/product-dashboard/utils/ProductModel";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import rating from "@/components/ui/Custom/rating";

const AttractionListForCust = ({agency_id} : {agency_id: number}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const enviUrl = import.meta.env.VITE_API_BASE_URL;
    const [attractions, setAttractions] = useState<DaumAttraction[]>([]);

    useEffect(() => {
        const fetchAttractions = async () => {
            try {
                const response = await axiosClient.post('/v1/GetActiveAttractionByAgencyId', {
                    agency_id: agency_id
                });
                setAttractions(response.data.data);
            } catch (error) {
                console.error('Error fetching attractions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAttractions();
    }, []);

    const selectItem = (id : number) => {
        navigate(`/Customer/AttractionDetail/${id}`);
    }

    return (
        <div>
            {loading ? (
            <div className="flex justify-center items-center min-h-screen">
                <HashLoader size={50} color={"#123abc"} loading={loading} />
            </div>
            ) : (
                attractions.reduce((rows: JSX.Element[][], attraction, index) => {
                    if (index % 4 === 0) {
                        rows.push([]);
                    }
                    rows[rows.length - 1].push(
                        <div key={attraction.ref_attraction_id} className='flex-1'>
                            <Card className='w-64 shadow-lg mt-10 mr-16 hover:cursor-pointer' onClick={() => selectItem(attraction.ref_attraction_id)}>
                            <img src={enviUrl + attraction.image_url} alt={attraction.attraction_name} className="h-36 w-full shadow-lg" />
                                <CardHeader>
                                    <CardTitle className='w-[200px] truncate min-h-8'>{attraction.attraction_name}</CardTitle>
                                    <CardDescription className="truncate">{attraction.description}</CardDescription>
                                </CardHeader>
                                <CardContent className='flex-1'>
                                    <p>{attraction.address}</p>
                                    <div className="flex flex-row  align-middle">
                                        {rating(attraction.rating)}
                                        {attraction.rating ? attraction.rating : 0 }
                                    </div>
                                    <p>{t('Price')}: Rp.{attraction.base_price}</p>
                                </CardContent>
                                <CardFooter>
                                    {/* <Button variant='primary' onClick={() => onEditAttraction(attraction.ref_attraction_id)}>{<EditIcon />}</Button>
                                    <AlertDialogProduct apiPath='/v1/DeactivateAttractionById' Id={attraction.ref_attraction_id} param='ref_attraction_id'/> */}
                                </CardFooter>
                            </Card>
                        </div>
                    );
                    return rows;
                }, []).map((row, index) => (
                    <div key={index} className='flex flex-row justify-left w-64'>
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

export default AttractionListForCust

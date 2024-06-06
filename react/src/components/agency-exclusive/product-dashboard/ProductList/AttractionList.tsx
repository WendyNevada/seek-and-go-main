import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from '@/components/ui/card'
import { useEffect, useState } from 'react';
import { DaumAttraction } from '../utils/ProductModel';
import { useLogin } from '@/context/LoginContext';
import axiosClient from '@/axios.client';
import { Button } from '@/components/ui/button';
import { AlertDialogProduct } from '../ProductComponent/DeleteProductAlert';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import rating from '@/components/ui/Custom/rating';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';

const AttractionList = () => {
    const { t } = useTranslation();
    const [attractions, setAttractions] = useState<DaumAttraction[]>([]);
    const navigate = useNavigate();
    const { user } = useLogin();
    const enviUrl = import.meta.env.VITE_API_BASE_URL;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch data from the API
        const fetchAttractions = async () => {
            try {
                const response = await axiosClient.post('/v1/GetActiveAttractionByAgencyId', {
                    agency_id: user?.agency_id
                }); // Replace 'your-api-url' with the actual API endpoint
                setAttractions(response.data.data); // Assuming the response data is an array of attractions
                setLoading(false);
            } catch (error) {
                console.error('Error fetching attractions:', error);
            }
        };
        fetchAttractions();
    }, []);

    const onEditAttraction = (refAttractionId: number) => {
        navigate(`/Agency/EditAttraction/${refAttractionId}`)
    }

    const renderSkeleton = () => (
        <div className="flex flex-col space-y-3 mx-8">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    );

    return (
        <div className='mt-2 justify-between'>
            {loading ? (
                <div className='flex flex-wrap'>
                    {Array(3).fill(0).map((_, index) => (
                        <div key={index} className='flex-1'>
                            {renderSkeleton()}
                        </div>
                    ))}
                </div>
            ) : (
                attractions.reduce((rows: JSX.Element[][], attraction, index) => {
                    if (index % 4 === 0) {
                        rows.push([]);
                    }
                    rows[rows.length - 1].push(
                        <div key={attraction.ref_attraction_id} className='flex-1'>
                            <Card className='w-64 shadow-lg mt-10 mr-16'>
                            <img src={enviUrl + attraction.image_url} alt={attraction.attraction_name} className="h-36 w-full shadow-lg" />
                                <CardHeader>
                                    <CardTitle className='w-[200px] truncate'>{attraction.attraction_name}</CardTitle>
                                    <CardDescription className='truncate'>{attraction.description}</CardDescription>
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
                                    <Button variant='primary' onClick={() => onEditAttraction(attraction.ref_attraction_id)}>{<EditIcon />}</Button>
                                    <AlertDialogProduct apiPath='/v1/DeactivateAttractionById' Id={attraction.ref_attraction_id} param='ref_attraction_id'/>
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

export default AttractionList

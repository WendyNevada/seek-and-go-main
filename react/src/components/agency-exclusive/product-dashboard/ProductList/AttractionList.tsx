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

const AttractionList = () => {
    const { t } = useTranslation();
    const [attractions, setAttractions] = useState<DaumAttraction[]>([]);
    const navigate = useNavigate();
    //const [selectedAttraction, setSelectedAttraction] = useState<GetAttractionModel | null>(null);
    const { user } = useLogin();
    const enviUrl = import.meta.env.VITE_API_BASE_URL;
    //const [showFullDescription, setShowFullDescription] = useState(false);

    useEffect(() => {
        // Fetch data from the API
        const fetchAttractions = async () => {
            console.log('uwu ', user?.agency_id)
            try {
                const response = await axiosClient.post('/v1/GetActiveAttractionByAgencyId', {
                    agency_id: user?.agency_id
                }); // Replace 'your-api-url' with the actual API endpoint
                setAttractions(response.data.data); // Assuming the response data is an array of attractions
            } catch (error) {
                console.error('Error fetching attractions:', error);
            }
        };
        fetchAttractions();
    }, []);

    const onEditAttraction = (refAttractionId: number) => {
        //ref_attraction_id
        navigate(`/Agency/EditAttraction/${refAttractionId}`)
    }

    return (
        <div className='mt-2 justify-between'>
            {attractions.reduce((rows: JSX.Element[][], attraction, index) => {
                if (index % 4 === 0) {
                    rows.push([]);
                }
                rows[rows.length - 1].push(
                    <div key={attraction.ref_attraction_id} className='flex-1'>
                        <Card className='w-64 shadow-lg mt-10 mr-16'>
                        <img src={enviUrl + attraction.image_url} alt={attraction.attraction_name} className="h-36 w-full shadow-lg" />
                            <CardHeader>
                                <CardTitle>{attraction.attraction_name}</CardTitle>
                                <CardDescription>{attraction.description}</CardDescription>
                                {/* {showFullDescription ? (
                                    <CardDescription>{attraction.description}</CardDescription>
                                ) : (
                                    <CardDescription>{attraction.description.slice(0, 100)}...</CardDescription>
                                )}
                                {!showFullDescription && (
                                    <button onClick={() => setShowFullDescription(true)} className="text-blue-500">See More</button>
                                )} */}
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
                                <AlertDialogProduct apiPath='/v1/DeactivateAttractionById' attractionId={attraction.ref_attraction_id} param='ref_attraction_id'/>
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
            ))}
        </div>
    )
}

export default AttractionList

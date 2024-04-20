import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from '@/components/ui/card'
import { useEffect, useState } from 'react';
import { GetAttractionModel } from '../utils/AttractionModel';
import { useLogin } from '@/context/LoginContext';
import axiosClient from '@/axios.client';
import { Button } from '@/components/ui/button';
import { AlertDialogProduct } from '../ProductComponent/DeleteProductAlert';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

const AttractionList = () => {
    const [attractions, setAttractions] = useState<GetAttractionModel[]>([]);
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
                const response = await axiosClient.post<GetAttractionModel[]>('/v1/GetActiveAttractionByAgencyId', {
                    agency_id: user?.agency_id
                }); // Replace 'your-api-url' with the actual API endpoint
                setAttractions(response.data); // Assuming the response data is an array of attractions
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
        <div className='mt-4 justify-between'>
            {attractions.reduce((rows: JSX.Element[][], attraction, index) => {
                if (index % 4 === 0) {
                    rows.push([]);
                }
                rows[rows.length - 1].push(
                    <div key={attraction.ref_attraction_id} className='flex-1'>
                        <Card className='w-72 shadow-lg mr-6 mt-10'>
                            <CardHeader>
                                <img src={enviUrl + attraction.image_url} alt={attraction.attraction_name} className="rounded-lg h-36 max-w-full shadow-lg" />
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
                                <p>{attraction.rating}</p>
                                <p>Base Price: Rp.{attraction.base_price}</p>
                            </CardContent>
                            <CardFooter>
                                <Button variant='primary' onClick={() => onEditAttraction(attraction.ref_attraction_id)}>{<EditIcon />}</Button>
                                <AlertDialogProduct attractionId={attraction.ref_attraction_id} />
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

export default AttractionList

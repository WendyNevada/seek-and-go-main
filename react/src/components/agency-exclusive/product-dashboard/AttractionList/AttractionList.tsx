import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card'
import { useEffect, useState } from 'react';
import { GetAttractionModel } from '../utils/AttractionModel';
import { useLogin } from '@/context/LoginContext';
import axiosClient from '@/axios.client';
import { Button } from '@/components/ui/button';
import { AlertDialogProduct } from '../ProductComponent/DeleteProductAlert';
import EditIcon from '@mui/icons-material/Edit';

const AttractionList = () => {
    const [attractions, setAttractions] = useState<GetAttractionModel[]>([]);
    const { user } = useLogin();
    const enviUrl = import.meta.env.VITE_API_BASE_URL;

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

    //api untuk get
    //GetActiveAttractionByAgencyId
    return (
        <div className='mt-4 flex flex-row'>
            {attractions.map(attraction => {
                return (
                    <Card key={attraction.ref_attraction_id} className='w-80 shadow-lg mr-10'>
                        <CardHeader>
                            <img src={enviUrl + attraction.image_url} alt={attraction.attraction_name} className="rounded-lg max-w-full max-h-200px shadow-lg" />
                            <CardTitle>{attraction.attraction_name}</CardTitle>
                            <CardDescription>{attraction.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>{attraction.address}</p>
                            <p>{attraction.rating}</p>
                            <p>Base Price: Rp.{attraction.base_price}</p>
                        </CardContent>
                        {/* Add more card components based on other properties */}
                        <CardFooter>
                            <Button variant='primary'>{<EditIcon/>}</Button>
                            <AlertDialogProduct attractionId={attraction.ref_attraction_id}/>
                            {/* <Button className='ml-2' variant="destructive">Delete</Button> */}
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    )
}

export default AttractionList

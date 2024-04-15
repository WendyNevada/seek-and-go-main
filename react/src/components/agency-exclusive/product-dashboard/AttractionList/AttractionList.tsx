import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { GetAttractionModel } from '../utils/AttractionModel';
import { useLogin } from '@/context/LoginContext';
import axiosClient from '@/axios.client';

const AttractionList = () => {
    const [attractions, setAttractions] = useState<GetAttractionModel[]>([]);
    const { user } = useLogin();

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
        <div>
            AttractionList
            {attractions.map(attraction => (
                <Card key={attraction.ref_attraction_id}>
                    <CardHeader>
                        <CardTitle>{attraction.attraction_name}</CardTitle>
                        <CardDescription>{attraction.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <img src={attraction.image_url} alt={attraction.attraction_name} style={{ maxWidth: '100%', maxHeight: '200px' }} />
                        <p>{attraction.address}</p>
                        <p>{attraction.rating}</p>
                        <p>Base Price: {attraction.base_price}</p>
                        {/* Add more properties as needed */}
                    </CardContent>
                    {/* Add more card components based on other properties */}
                </Card>
            ))}
        </div>
    )
}

export default AttractionList

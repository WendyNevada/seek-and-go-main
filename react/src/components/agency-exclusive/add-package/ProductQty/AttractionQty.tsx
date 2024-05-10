import { useLogin } from '@/context/LoginContext';
import React, { useEffect, useState } from 'react'
import { DaumVehicle } from '../../product-dashboard/utils/ProductModel';
import axiosClient from '@/axios.client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AttractionQtyProps {
    attractionQty: number;
    onDetailsChange: (details: { ref_attraction_id?: string | null }[]) => void; // Function to handle details change
    onAttractionQtyChange: (attractionQty: number) => void;
}

const AttractionQty = ( {attractionQty, onDetailsChange, onAttractionQtyChange } : AttractionQtyProps ) => {
    const { user } = useLogin();
    const [vehicle, setVehicle] = useState<DaumVehicle[]>([]);
    const [details, setDetails] = useState<{ ref_attraction_id?: string | null }[]>([]);

    //GetActiveVehicleByAgencyId
    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const response = await axiosClient.post<DaumVehicle[]>('/v1/GetActiveVehicleByAgencyId', {
                    agency_id: user?.agency_id
                }); // Replace 'your-api-url' with the actual API endpoint
                setVehicle(response.data); // Assuming the response data is an array of vehicles
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            }
        }
        fetchVehicle();
    },[]);


    const handleDetailChange = (index: number, value: string) => {
        const newDetails = [...details];
        newDetails[index] = { ref_attraction_id: value }; // Create a new object for the detail
        setDetails(newDetails);
        onDetailsChange(newDetails);
    };

    const handleRemoveDetail = (index: number) => {
        const newDetails = [...details];
        newDetails.splice(index, 1);
        setDetails(newDetails);
        onDetailsChange(newDetails);
        onAttractionQtyChange(attractionQty - 1);
    };

    return (
        <div>
            {Array.from({ length: attractionQty }).map((_, index) => (
                <div key={index} className="flex flex-row gap-4">
                    {/* <input
                        type="text"
                        placeholder="Attraction ID"
                        value={details[index]?.ref_attraction_id || ''}
                        onChange={(e) => handleDetailChange(index, e.target.value)}
                    /> */}

                    <Select onValueChange={(newValue) => handleDetailChange(index, newValue)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Vehicle" />
                        </SelectTrigger>
                        <SelectContent>
                            {vehicle.map((vehicleItem) => (
                                <SelectItem key={vehicleItem.ref_vehicle_id} value={vehicleItem.vehicle_name}>
                                    {vehicleItem.vehicle_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <button onClick={() => handleRemoveDetail(index)}>Remove</button>
                </div>
            ))}
        </div>
    )
}

export default AttractionQty

import axiosClient from '@/axios.client';
import { useLogin } from '@/context/LoginContext';
import React, { useEffect, useState } from 'react'
import { DaumVehicle } from '../../product-dashboard/utils/ProductModel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

//  icon
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

interface VehicleQtyProps {
    vehicleQty: number;
    onDetailsChange: (details: { ref_vehicle_id?: string | null }[]) => void; // Function to handle details change
    onVehicleQtyChange: (vehicleQty: number) => void;
}

const VehicleQty = ({vehicleQty, onDetailsChange, onVehicleQtyChange } : VehicleQtyProps) => {
    const { user } = useLogin();
    const [vehicle, setVehicle] = useState<DaumVehicle[]>([]);
    const [details, setDetails] = useState<{ ref_vehicle_id?: string | null }[]>([]);
    const enviUrl = import.meta.env.VITE_API_BASE_URL;

    //GetActiveVehicleByAgencyId
    useEffect(() => {
        const fetchAttraction = async () => {
            try {
                const response = await axiosClient.post<DaumVehicle[]>('/v1/GetActiveVehicleByAgencyId', {
                    agency_id: user?.agency_id
                }); // Replace 'your-api-url' with the actual API endpoint
                setVehicle(response.data); // Assuming the response data is an array of vehicles
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            }
        }
        fetchAttraction();
    },[]);


    const handleDetailChange = (index: number, value: string) => {
        const newDetails = [...details];
        newDetails[index] = { ref_vehicle_id: value }; // Create a new object for the detail
        setDetails(newDetails);
        onDetailsChange(newDetails);

        const selectedAttraction = vehicle.find(vehicleItem => vehicleItem.vehicle_name === value);
        if (selectedAttraction) {
            const updatedVehicle = [...vehicle];
            updatedVehicle[index].image_url = selectedAttraction.image_url;
            setVehicle(updatedVehicle);
        }
    };

    const handleRemoveDetail = (index: number) => {
        const newDetails = [...details];
        newDetails.splice(index, 1);
        setDetails(newDetails);
        onDetailsChange(newDetails);
        onVehicleQtyChange(vehicleQty - 1);
    };


    return (
        <div>
            {Array.from({ length: vehicleQty }).map((_, index) => (
                <div key={index} className="flex flex-col gap-4 my-2">
                    <div className="flex flex-row">
                        <Select onValueChange={(newValue) => handleDetailChange(index, newValue)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Attraction" />
                            </SelectTrigger>
                            <SelectContent>
                                {vehicle.map((vehicleItem) => (
                                    <SelectItem key={vehicleItem.ref_vehicle_id} value={vehicleItem.vehicle_name}>
                                        {vehicleItem.vehicle_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button className='ml-2' variant={'destructive'} onClick={() => handleRemoveDetail(index)}>{<HighlightOffIcon/>}</Button>
                    </div>

                    <div className="border-2 rounded-md">
                        {details[index]?.ref_vehicle_id && vehicle[index]?.image_url ? (
                            <div className='flex flex-row'>
                                <div className="ml-1 mt-4">
                                    {details[index]?.ref_vehicle_id && (
                                        <img src={enviUrl + vehicle[index]?.image_url} className='w-64 ml-4 rounded-md'/>
                                    )}
                                </div>
                                <div className="">
                                    {details[index]?.ref_vehicle_id && (
                                        <div className="flex flex-col m-2 space-y-4">
                                            <Table>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell className="font-medium">Product Name :</TableCell>
                                                        <TableCell className="font-medium">{vehicle[index]?.vehicle_name}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="font-medium">Base Price :</TableCell>
                                                        <TableCell className="font-medium">{vehicle[index]?.base_price}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="font-medium">Address :</TableCell>
                                                        <TableCell className="font-medium">{vehicle[index]?.address}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="font-medium">Description :</TableCell>
                                                        <TableCell className="font-medium">{vehicle[index]?.description}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className='text-center text-sm'>No vehicle selected</p> // Fallback message or content
                        )}
                    </div>

                </div>
            ))}
        </div>
    )
}

export default VehicleQty

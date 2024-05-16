import { useLogin } from '@/context/LoginContext';
import React, { useEffect, useState } from 'react'
import { DaumAttraction } from '../../product-dashboard/utils/ProductModel';
import axiosClient from '@/axios.client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

//  icon
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { formatPrice } from '@/utils/priceFormating';
import { useTranslation } from 'react-i18next';


interface AttractionQtyProps {
    attractionQty: number;
    onDetailsChange: (details: { ref_attraction_id?: string | null }[]) => void; // Function to handle details change
    onAttractionQtyChange: (attractionQty: number) => void;
}

const AttractionQty = ( {attractionQty, onDetailsChange, onAttractionQtyChange } : AttractionQtyProps ) => {
    const { t } = useTranslation();
    const { user } = useLogin();
    const [attraction, setAttraction] = useState<DaumAttraction[]>([]);
    const [details, setDetails] = useState<{ ref_attraction_id?: string | null }[]>([]);
    const [newAttractions, setNewAttractions] = useState<DaumAttraction[]>(Array.from({ length: attractionQty }, () => ({} as DaumAttraction)));

    const enviUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchAttraction = async () => {
            try {
                const response = await axiosClient.post('/v1/GetActiveAttractionByAgencyId', {
                    agency_id: user?.agency_id
                }); // Replace 'your-api-url' with the actual API endpoint
                setAttraction(response.data.data);
            } catch (error) {
                console.error('Error fetching attractions:', error);
            }
        }
        fetchAttraction();
    },[]);


    const handleDetailChange = (index: number, value: string) => {
        const newDetails = [...details];
        newDetails[index] = { ref_attraction_id: value }; // Create a new object for the detail
        setDetails(newDetails);
        onDetailsChange(newDetails);

        const selectedAttraction = attraction.find(attractionItem => Number(attractionItem.ref_attraction_id) === Number(value));
        if (selectedAttraction) {
            setNewAttractions(prevAttractions => {
                const updatedAttractions = [...prevAttractions];
                updatedAttractions[index] = {
                    ...updatedAttractions[index],
                    attraction_name: selectedAttraction.attraction_name,
                    image_url: selectedAttraction.image_url,
                    base_price: selectedAttraction.base_price,
                    address: selectedAttraction.address,
                    description: selectedAttraction.description
                };
                return updatedAttractions;
            });
        }
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
                <div key={index} className="flex flex-col gap-4 my-2">
                    <div className="flex flex-row">
                        <Select onValueChange={(newValue) => handleDetailChange(index, newValue)}>
                            <SelectTrigger>
                                <SelectValue placeholder={t('Select Attraction')} />
                            </SelectTrigger>
                            <SelectContent>
                                {attraction.map((attractionItem) => (
                                    <SelectItem key={attractionItem.ref_attraction_id} value={attractionItem.ref_attraction_id.toString()}>
                                        {attractionItem.attraction_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button className='ml-2' variant={'destructive'} onClick={() => handleRemoveDetail(index)}>{<HighlightOffIcon/>}</Button>
                    </div>

                    <div className="border-2 rounded-md">
                        {details[index]?.ref_attraction_id && newAttractions[index]?.image_url ? (
                            <div className='flex flex-row'>
                                <div className="ml-1 mt-4">
                                    {details[index]?.ref_attraction_id && (
                                        <img src={enviUrl + newAttractions[index]?.image_url} className='w-64 ml-4 rounded-md'/>
                                    )}
                                </div>
                                <div className="">
                                    {details[index]?.ref_attraction_id && (
                                        <div className="flex flex-col m-2 space-y-4">
                                            <Table>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell className="font-medium">{t('Product Name')} :</TableCell>
                                                        <TableCell className="font-medium">{newAttractions[index]?.attraction_name}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="font-medium">{t('Price')} :</TableCell>
                                                        <TableCell className="font-medium">{formatPrice(newAttractions[index]?.base_price)}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="font-medium">{t('Address')} :</TableCell>
                                                        <TableCell className="font-medium">{newAttractions[index]?.address}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="font-medium">{t('Description')} :</TableCell>
                                                        <TableCell className="font-medium">{newAttractions[index]?.description}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className='text-center text-sm'>{t('No attraction selected')}</p> // Fallback message or content
                        )}
                    </div>

                </div>
            ))}
        </div>
    )
}

export default AttractionQty

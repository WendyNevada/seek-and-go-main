import axiosClient from '@/axios.client';
import { useLogin } from '@/context/LoginContext';
import React, { useEffect, useState } from 'react'
import { DaumVehicle } from '../../product-dashboard/utils/ProductModel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

//  icon
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { formatPrice } from '@/utils/priceFormating';
import { useTranslation } from 'react-i18next';

interface VehicleQtyProps {
    vehicleQty: number;
    onDetailsChange: (details: { ref_vehicle_id?: string | null }[]) => void; // Function to handle details change
    onVehicleQtyChange: (vehicleQty: number) => void;
}

const VehicleQty = ({ vehicleQty, onDetailsChange, onVehicleQtyChange }: VehicleQtyProps) => {
    const { t } = useTranslation();
    const { user } = useLogin();
    const [vehicle, setVehicle] = useState<DaumVehicle[]>([]);
    const [details, setDetails] = useState<{ ref_vehicle_id?: string | null }[]>(Array.from({ length: vehicleQty }, () => ({ ref_vehicle_id: null })));
    const [newVehicles, setNewVehicles] = useState<DaumVehicle[]>(Array.from({ length: vehicleQty }, () => ({} as DaumVehicle)));

    const enviUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchAttraction = async () => {
            try {
                const response = await axiosClient.post<DaumVehicle[]>('/v1/GetActiveVehicleByAgencyId', {
                    agency_id: user?.agency_id
                });
                setVehicle(response.data);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            }
        };
        fetchAttraction();
    }, []);

    const handleDetailChange = (index: number, value: string) => {
        const newDetails = [...details];
        newDetails[index] = { ref_vehicle_id: value };
        setDetails(newDetails);
        onDetailsChange(newDetails);

        const selectedVehicle = vehicle.find(vehicleItem => Number(vehicleItem.ref_vehicle_id) === Number(value));
        if (selectedVehicle) {
            setNewVehicles(prevVehicles => {
                const updatedVehicles = [...prevVehicles];
                updatedVehicles[index] = {
                    ...updatedVehicles[index],
                    vehicle_code: selectedVehicle.vehicle_code,
                    image_url: selectedVehicle.image_url,
                    base_price: selectedVehicle.base_price,
                    address: selectedVehicle.address,
                    description: selectedVehicle.description
                };
                return updatedVehicles;
            });
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
                                <SelectValue placeholder={t('Select Vehicle')} />
                            </SelectTrigger>
                            <SelectContent>
                                {vehicle.map((vehicleItem) => (
                                    <SelectItem key={vehicleItem.ref_vehicle_id} value={vehicleItem.ref_vehicle_id.toString()}>
                                        {vehicleItem.vehicle_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button className='ml-2' variant={'destructive'} onClick={() => handleRemoveDetail(index)}>
                            {<HighlightOffIcon />}
                        </Button>
                    </div>
                    <div className="border-2 rounded-md">
                        {details[index]?.ref_vehicle_id && newVehicles[index]?.image_url ? (
                            <div className='flex flex-row'>
                                <div className="ml-1 mt-4">
                                    {details[index]?.ref_vehicle_id && (
                                        <img src={enviUrl + newVehicles[index]?.image_url} className='w-64 ml-4 rounded-md' />
                                    )}
                                </div>
                                <div className="">
                                    {details[index]?.ref_vehicle_id && (
                                        <div className="flex flex-col m-2 space-y-4">
                                            <Table>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell className="font-medium">{t('Product Name')} :</TableCell>
                                                        <TableCell className="font-medium">{newVehicles[index]?.vehicle_code}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="font-medium">{t('Price')} :</TableCell>
                                                        <TableCell className="font-medium">{formatPrice(newVehicles[index]?.base_price)}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="font-medium">{t('Address')} :</TableCell>
                                                        <TableCell className="font-medium">{newVehicles[index]?.address}</TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className="font-medium">{t('Description')} :</TableCell>
                                                        <TableCell className="font-medium">{newVehicles[index]?.description}</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className='text-center text-sm'>{t('No vehicle selected')}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default VehicleQty;


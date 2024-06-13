import axiosClient from '@/axios.client';
import { useLogin } from '@/context/LoginContext';
import { useEffect, useState } from 'react'
import { DaumHotel } from '../../product-dashboard/utils/ProductModel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

//  icon
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

// function
import { formatPrice } from '@/utils/priceFormating';
import { useTranslation } from 'react-i18next';
import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from './component/rangeDatePicker';
import { addDays } from 'date-fns';

interface HotelQtyProps {
    hotelQty: number;
    agency_id_param?: number | null | undefined;
    initialDetails?: { ref_hotel_id?: string | null | undefined }[];
    onDetailsChange: (details: { ref_hotel_id?: string | null , start_dt?: string | null, end_dt?: string | null }[]) => void; // Function to handle details change
    onHotelQtyChange: (hotelQty: number) => void;
}

const HotelQty = ({hotelQty, initialDetails, onDetailsChange, onHotelQtyChange, agency_id_param } : HotelQtyProps) => {
    const { t } = useTranslation();
    const { user } = useLogin();
    const [hotel, setHotel] = useState<DaumHotel[]>([]);
    const [details, setDetails] = useState<{ ref_hotel_id?: string | null, start_dt?: string | null, end_dt?: string | null }[]>(Array.from({ length: hotelQty }, () => ({ ref_hotel_id: null })));
    const [newHotels, setNewHotels] = useState<DaumHotel[]>(Array.from({ length: hotelQty }, () => ({} as DaumHotel)));
    const [startDt, setStartDt] = useState('');
    const [endDt, setEndDt] = useState('');

    const enviUrl = import.meta.env.VITE_API_BASE_URL;

    const handleDateChange = (index: number, date: DateRange | undefined) => {
        if (date) {
            const newDetails = [...details];
            const start_dt = date?.from ? (addDays(date.from, 1)).toISOString().split('T')[0] : '';
            const end_dt = date?.to ? (addDays(date.to, 1)).toISOString().split('T')[0] : '';
            newDetails[index] = {
                ...newDetails[index],
                start_dt,
                end_dt,
            };
            setDetails(newDetails);
            onDetailsChange(newDetails);
        } else {
            setStartDt('');
            setEndDt('');
        }
    };

    useEffect(() => {
        const fetchAttraction = async () => {
            try {
                const response = await axiosClient.post('/v1/GetActiveHotelByAgencyId', {
                    agency_id: (user && user.agency_id > 0 ? user.agency_id : agency_id_param)
                });
                setHotel(response.data.data);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            }
        };
        fetchAttraction();
    }, []);

    useEffect(() => {
        if (initialDetails && initialDetails.length > 0) {
            const initialHotels = initialDetails.map((detail) => {
                const selectedVehicle = hotel.find((hotelItem) => {
                    const detailId = detail.ref_hotel_id;
                    return detailId !== null && detailId !== undefined && hotelItem.ref_hotel_id === parseInt(detailId);
                });
                return selectedVehicle || ({} as DaumHotel);
            });
            setDetails(initialDetails);
            setNewHotels(initialHotels);
        }
    }, [hotel, initialDetails]);

    const handleDetailChange = (index: number, value: string) => {
        const newDetails = [...details];
        newDetails[index] = { ref_hotel_id: value, start_dt: startDt, end_dt: endDt }; // Create a new object for the detail
        setDetails(newDetails);
        onDetailsChange(newDetails);

        const selectedHotel = hotel.find(hotelItem => Number(hotelItem.ref_hotel_id) === Number(value));
        if (selectedHotel) {
            setNewHotels(prevHotels => {
                const updatedHotels = [...prevHotels];
                updatedHotels[index] = {
                    ...updatedHotels[index],
                    hotel_name: selectedHotel.hotel_name,
                    image_url: selectedHotel.image_url,
                    base_price: selectedHotel.base_price,
                    address_zipcode: selectedHotel.address_zipcode,
                    description: selectedHotel.description
                };
                return updatedHotels;
            });
        }
    };

    const handleRemoveDetail = (index: number) => {
        const newDetails = [...details];
        newDetails.splice(index, 1);
        setDetails(newDetails);
        onDetailsChange(newDetails);
        onHotelQtyChange(hotelQty - 1);
    };

    return (
        <div>
            {Array.from({ length: hotelQty }).map((_, index) => (
                <div key={index} className="flex flex-col gap-4 my-2">
                    <div className="flex flex-row">
                        <Select onValueChange={(newValue) => handleDetailChange(index, newValue)}>
                            <SelectTrigger>
                                <SelectValue placeholder={t('Select Hotel')} />
                            </SelectTrigger>
                            <SelectContent>
                                {hotel.map((hotelItem) => (
                                    <SelectItem key={hotelItem.ref_hotel_id} value={hotelItem.ref_hotel_id.toString()}>
                                        {hotelItem.hotel_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button className='ml-2' variant={'destructive'} onClick={() => handleRemoveDetail(index)}>{<HighlightOffIcon/>}</Button>
                    </div>

                    <div className="border-2 rounded-md flex">
                        {details[index]?.ref_hotel_id && newHotels[index]?.image_url ? (
                            <div className='flex flex-row'>
                                <div className="ml-1 mt-4">
                                    {details[index]?.ref_hotel_id && (
                                        <img src={enviUrl + newHotels[index]?.image_url} className='w-64 ml-4 rounded-md'/>
                                    )}
                                </div>
                                <div className="">
                                    {details[index]?.ref_hotel_id && (
                                        <div className="flex flex-col m-2 space-y-4">
                                            <Table>
                                                <TableBody>
                                                    <TableRow className='flex'>
                                                        <TableCell className="font-medium">{t('Product Name')} :</TableCell>
                                                        <TableCell className="font-medium flex ">{newHotels[index]?.hotel_name}</TableCell>
                                                    </TableRow>
                                                    <TableRow className='flex'>
                                                        <TableCell className="font-medium">{t('Price')} :</TableCell>
                                                        <TableCell className="font-medium flex">{formatPrice(newHotels[index]?.base_price)}</TableCell>
                                                    </TableRow>
                                                    <TableRow className='flex'>
                                                        <TableCell className="font-medium">{t('Address')} :</TableCell>
                                                        <TableCell className="font-medium flex ">{newHotels[index]?.address_zipcode}</TableCell>
                                                    </TableRow>
                                                    <TableRow className='flex'>
                                                        <TableCell className="font-medium">{t('Description')} :</TableCell>
                                                        <TableCell className="font-medium flex">{newHotels[index]?.description}</TableCell>
                                                    </TableRow>
                                                    {
                                                        agency_id_param ? (
                                                            <TableRow className='flex'>
                                                                <TableCell className="font-medium">{t('Date')} :</TableCell>
                                                                <TableCell className="font-medium">
                                                                <DatePickerWithRange
                                                                    onDateChange={(date) => handleDateChange(index, date)}
                                                                    startDt={startDt}
                                                                    endDt={endDt}
                                                                    // startDt={details[index]?.start_dt || ''}
                                                                    // endDt={details[index]?.end_dt || ''}
                                                                />
                                                                </TableCell>
                                                            </TableRow>
                                                        ) : (
                                                            <TableRow>
                                                                
                                                            </TableRow>
                                                        )
                                                    }
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className='text-center text-sm'>{t('No hotel selected')}</p> // Fallback message or content
                        )}
                    </div>

                </div>
            ))}
        </div>
    )
}

export default HotelQty

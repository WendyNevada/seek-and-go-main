import { useForm } from 'react-hook-form'
import { addPackage } from './utils/schema'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Required } from '@/components/ui/Custom/required'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import AttractionQty from './ProductQty/AttractionQty'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import VehicleQty from './ProductQty/VehicleQty'
import HotelQty from './ProductQty/HotelQty'
import { useTranslation } from 'react-i18next'
import { useLogin } from '@/context/LoginContext'
import { hitAddApi } from '@/context/HitApi'
import { urlConstant } from '@/urlConstant'
import { useNavigate } from 'react-router-dom'

const AddPackage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [attractionQty, setAttractionQty] = useState<number>(0);
    const [vehicleQty, setVehicleQty] = useState<number>(0);
    const [hotelQty, setHotelQty] = useState<number>(0);
    const [attractionDetails, setAttractionDetails] = useState<addPackage['details']>([]);
    const [vehicleDetails, setVehicleDetails] = useState<addPackage['details']>([]);
    const [hotelDetails, setHotelDetails] = useState<addPackage['details']>([]);
    const { user } = useLogin();

    const form = useForm<addPackage>({
        defaultValues: {
            package_code: "",
            agency_id: String(user?.agency_id),
            package_name: "",
            description: "",
            package_price: 0,
            qty: 0,
            total_days: 0,
            details: []
        }
    })

    const handleAttractionDetailsChange = (newDetails: addPackage['details']) => {
        setAttractionDetails(newDetails);
    };

    const handleVehicleDetailsChange = (newDetails: addPackage['details']) => {
        setVehicleDetails(newDetails);
    };

    const handleHotelDetailsChange = (newDetails: addPackage['details']) => {
        setHotelDetails(newDetails);
    }

    const onSubmit = async (values: addPackage) => {
        const mergedDetails = [...attractionDetails, ...vehicleDetails, ...hotelDetails].map(detail => ({
            ref_attraction_id: detail.ref_attraction_id || null,
            ref_vehicle_id: detail.ref_vehicle_id || null,
            ref_hotel_id: detail.ref_hotel_id || null,
            start_date: detail.start_dt || null,
            end_date: detail.end_dt || null
        }));
        const payload = { ...values, details: mergedDetails };
        const response = await hitAddApi("/v1/CreatePackageAgency",payload);
        if(response === 200)
        {
            navigate(urlConstant.AgencyProduct);
        }
    }

    return (
        <div className="min-h-50 w-50 p-0 sm:p-12">
            <div className="mx-auto max-w-6xl px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <h1 className="text-2xl mb-8">{t('Add Package')}</h1>

                        <div className="flex flex-row space-x-4">
                            <FormField
                                control={form.control}
                                name="package_code"
                                render={({ field }) => (
                                    <FormItem className="custom-field w-80">
                                        <FormLabel>{t('Package Code')}</FormLabel>
                                        <Required/>
                                        <FormControl className='w-full'>
                                            <Input
                                                placeholder={t('Input Package Code')}
                                                {...field}
                                                onChange={field.onChange}
                                                maxLength={7}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="package_name"
                                render={({ field }) => (
                                    <FormItem className="custom-field w-80">
                                        <FormLabel>{t('Package Name')}</FormLabel>
                                        <Required/>
                                        <FormControl className='w-full'>
                                            <Input
                                                placeholder={t('Input Package Name')}
                                                {...field}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex flex-row space-x-4">
                            <FormField
                                control={form.control}
                                name="package_price"
                                render={({ field }) => (
                                    <FormItem className="custom-field w-80">
                                        <FormLabel>{t('Package Price')}</FormLabel>
                                        <Required/>
                                        <FormControl className='w-full'>
                                            <Input
                                                placeholder={t('Input Package Price')}
                                                {...field}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="qty"
                                render={({ field }) => (
                                    <FormItem className="custom-field w-80">
                                        <FormLabel>{t('QTY')}</FormLabel>
                                        <Required/>
                                        <FormControl className='w-full'>
                                            <Input
                                                type='number'
                                                placeholder={t('Input QTY')}
                                                {...field}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="total_days"
                                render={({ field }) => (
                                    <FormItem className="custom-field w-80">
                                        <FormLabel>{t('Total Days')}</FormLabel>
                                        <Required/>
                                        <FormControl className='w-full'>
                                            <Input
                                                type='number'
                                                placeholder={t('Input Total Days')}
                                                {...field}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="custom-field md:w-[41rem]">
                                    <FormLabel>{t('Description')}</FormLabel>
                                    <Required/>
                                    <FormControl>
                                        <Textarea
                                            placeholder={t('Description')}
                                            {...field}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <h1 className="text-xl mb-4 mt-6">{t('Detail Package')}</h1>

                        <div className="flex flex-row space-x-4">
                            <div className="grid w-32 max-w-sm items-center text-center my-2">
                                {/* <Input className='w-24' type="number" placeholder="Attraction qty" value={attractionQty} onChange={handleAttractionQtyChange}/> */}
                                <Button type='button' variant={"outline"} className='w-38' onClick={() => setAttractionQty(attractionQty + 1)}>+ {t('Add Attraction')}</Button>
                            </div>
                        </div>
                        <AttractionQty attractionQty={attractionQty} onDetailsChange={handleAttractionDetailsChange} onAttractionQtyChange={setAttractionQty}/>

                        <div className="flex flex-row space-x-4">
                            <div className="grid w-32 max-w-sm items-center text-center my-2">
                                {/* <Input className='w-24' type="number" placeholder="Attraction qty" value={attractionQty} onChange={handleAttractionQtyChange}/> */}
                                <Button type='button' variant={"outline"} className='w-38' onClick={() => setVehicleQty(vehicleQty + 1)}>+ {t('Add Vehicle')}</Button>
                            </div>
                        </div>
                        <VehicleQty vehicleQty={vehicleQty} onDetailsChange={handleVehicleDetailsChange} onVehicleQtyChange={setVehicleQty}/>

                        <div className="flex flex-row space-x-4">
                            <div className="grid w-32 max-w-sm items-center text-center my-2">
                                {/* <Input className='w-24' type="number" placeholder="Attraction qty" value={attractionQty} onChange={handleAttractionQtyChange}/> */}
                                <Button type='button' variant={"outline"} className='w-38' onClick={() => setHotelQty(hotelQty + 1)}>+ {t('Add Hotel')}</Button>
                            </div>
                        </div>
                        <HotelQty hotelQty={hotelQty} onDetailsChange={handleHotelDetailsChange} onHotelQtyChange={setHotelQty}/>

                        <div className="justify-center flex">
                            <Button type="submit" className='mt-4'>{t('Add Package')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default AddPackage

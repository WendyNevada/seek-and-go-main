import { useLogin } from "@/context/LoginContext";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { addPackageCustom } from "./interface/interface";
import { useForm } from "react-hook-form";
import { hitAddApi } from "@/context/HitApi";
import { urlConstant } from "@/urlConstant";
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from "@/components/ui/input";
import { Required } from "@/components/ui/Custom/required";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import AttractionQty from "@/components/agency-exclusive/add-package/ProductQty/AttractionQty";
import VehicleQty from "@/components/agency-exclusive/add-package/ProductQty/VehicleQty";
import HotelQty from "@/components/agency-exclusive/add-package/ProductQty/HotelQty";

const RequestPackage = ({agency_id} : {agency_id: number}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [attractionQty, setAttractionQty] = useState<number>(0);
    const [vehicleQty, setVehicleQty] = useState<number>(0);
    const [hotelQty, setHotelQty] = useState<number>(0);
    const [attractionDetails, setAttractionDetails] = useState<addPackageCustom['details']>([]);
    const [vehicleDetails, setVehicleDetails] = useState<addPackageCustom['details']>([]);
    const [hotelDetails, setHotelDetails] = useState<addPackageCustom['details']>([]);
    const { user } = useLogin();

    const form = useForm<addPackageCustom>({
        defaultValues: {
            package_code: "",
            agency_id: agency_id,
            customer_id: user?.customer_id,
            package_name: "",
            description: "",
            total_days: 0,
            details: []
        }
    })

    const handleAttractionDetailsChange = (newDetails: addPackageCustom['details']) => {
        setAttractionDetails(newDetails);
    };

    const handleVehicleDetailsChange = (newDetails: addPackageCustom['details']) => {
        setVehicleDetails(newDetails);
    };

    const handleHotelDetailsChange = (newDetails: addPackageCustom['details']) => {
        setHotelDetails(newDetails);
    }

    const onSubmit = async (values: addPackageCustom) => {
        const mergedDetails = [...attractionDetails, ...vehicleDetails, ...hotelDetails].map(detail => ({
            ref_attraction_id: detail.ref_attraction_id || null,
            ref_vehicle_id: detail.ref_vehicle_id || null,
            ref_hotel_id: detail.ref_hotel_id || null,
            start_date: detail.start_dt || null,
            end_date: detail.end_dt || null
        }));

        const payload = { ...values, details: mergedDetails };
        const response = await hitAddApi("/v1/CreateCustomPackageCustomer",payload);
        if(response === 200)
        {
            navigate(urlConstant.HomePage);
        }
    }

    return (
        <div className="min-h-50 w-50 p-0 sm:p-12">
            <div className="mx-auto max-w-6xl px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <h1 className="text-2xl mb-8">{t('Add Custom Package')}</h1>

                        <div className="flex flex-row space-x-5">
                            <FormField
                                control={form.control}
                                name="package_name"
                                render={({ field }) => (
                                    <FormItem className="custom-field w-72 mb-4">
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

                        {/* <div className="flex flex-row space-x-4">
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
                        </div> */}

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
                        <AttractionQty attractionQty={attractionQty} onDetailsChange={handleAttractionDetailsChange} onAttractionQtyChange={setAttractionQty} agency_id_param={agency_id}/>

                        <div className="flex flex-row space-x-4">
                            <div className="grid w-32 max-w-sm items-center text-center my-2">
                                {/* <Input className='w-24' type="number" placeholder="Attraction qty" value={attractionQty} onChange={handleAttractionQtyChange}/> */}
                                <Button type='button' variant={"outline"} className='w-38' onClick={() => setVehicleQty(vehicleQty + 1)}>+ {t('Add Vehicle')}</Button>
                            </div>
                        </div>
                        <VehicleQty vehicleQty={vehicleQty} onDetailsChange={handleVehicleDetailsChange} onVehicleQtyChange={setVehicleQty} agency_id_param={agency_id}/>

                        <div className="flex flex-row space-x-4">
                            <div className="grid w-32 max-w-sm items-center text-center my-2">
                                {/* <Input className='w-24' type="number" placeholder="Attraction qty" value={attractionQty} onChange={handleAttractionQtyChange}/> */}
                                <Button type='button' variant={"outline"} className='w-38' onClick={() => setHotelQty(hotelQty + 1)}>+ {t('Add Hotel')}</Button>
                            </div>
                        </div>
                        <HotelQty hotelQty={hotelQty} onDetailsChange={handleHotelDetailsChange} onHotelQtyChange={setHotelQty} agency_id_param={agency_id}/>

                        <div className="justify-center flex">
                            <Button type="submit" variant={"primary"} className='mt-4 hover:bg-blue-300'>{t('Add Package')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default RequestPackage

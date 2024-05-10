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

const AddPackage = () => {
    const [attractionQty, setAttractionQty] = useState<number>(0);
    const [vehicleQty, setVehicleQty] = useState<number>(0);
    const [hotelQty, setHotelQty] = useState<number>(0);
    const [attractionDetails, setAttractionDetails] = useState<addPackage['details']>([]);
    const [vehicleDetails, setVehicleDetails] = useState<addPackage['details']>([]);
    const [hotelDetails, setHotelDetails] = useState<addPackage['details']>([]);

    const form = useForm<addPackage>({
        defaultValues: {
            package_code: "",
            agency_id: "",
            package_name: "",
            description: "",
            package_price: 0,
            qty: 0,
            total_days: "",
            details: []
        }
    })

    const handleAttractionDetailsChange = (newDetails: addPackage['details']) => {
        setAttractionDetails(newDetails);
        console.log('attraction details : ', newDetails);
    };

    const handleVehicleDetailsChange = (newDetails: addPackage['details']) => {
        setVehicleDetails(newDetails);
        console.log('vehicle details : ', newDetails);
    };

    const handleHotelDetailsChange = (newDetails: addPackage['details']) => {
        setHotelDetails(newDetails);
        console.log('hotel details : ', newDetails);
    }

    const onSubmit = async (values: addPackage) => {
        const mergedDetails = [...attractionDetails, ...vehicleDetails, ...hotelDetails];
        const payload = { ...values, details: mergedDetails };
        console.log('merged details : ',mergedDetails);
        console.log('merged values : ',payload);
    }

    return (
        <div className="min-h-50 w-50 p-0 sm:p-12">
            <div className="mx-auto max-w-6xl px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <h1 className="text-2xl mb-8">Add Package</h1>

                        <div className="flex flex-row space-x-4">
                            <FormField
                                control={form.control}
                                name="package_code"
                                render={({ field }) => (
                                    <FormItem className="custom-field w-80">
                                        <FormLabel>{"Package Code"}</FormLabel>
                                        <Required/>
                                        <FormControl className='w-full'>
                                            <Input
                                                placeholder={"Input Package Code"}
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
                                        <FormLabel>{"Package Name"}</FormLabel>
                                        <Required/>
                                        <FormControl className='w-full'>
                                            <Input
                                                placeholder={"Input Package Name"}
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
                                        <FormLabel>{"Package Price"}</FormLabel>
                                        <Required/>
                                        <FormControl className='w-full'>
                                            <Input
                                                placeholder={"Input Package Price"}
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
                                        <FormLabel>{"QTY"}</FormLabel>
                                        <Required/>
                                        <FormControl className='w-full'>
                                            <Input
                                                type='number'
                                                placeholder={"Input QTY"}
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
                                        <FormLabel>{"Total Days"}</FormLabel>
                                        <Required/>
                                        <FormControl className='w-full'>
                                            <Input
                                                type='number'
                                                placeholder={"Input Total Days"}
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
                                    <FormLabel>{"Description"}</FormLabel>
                                    <Required/>
                                    <FormControl>
                                        <Textarea
                                            placeholder={"Input Description"}
                                            {...field}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <h1 className="text-xl mb-4 mt-6">Detail Package</h1>

                        <div className="flex flex-row space-x-4">
                            <div className="grid w-32 max-w-sm items-center text-center my-2">
                                {/* <Input className='w-24' type="number" placeholder="Attraction qty" value={attractionQty} onChange={handleAttractionQtyChange}/> */}
                                <Button variant={"outline"} className='w-32' onClick={() => setAttractionQty(attractionQty + 1)}>+ Add Attraction</Button>
                            </div>
                        </div>
                        <AttractionQty attractionQty={attractionQty} onDetailsChange={handleAttractionDetailsChange} onAttractionQtyChange={setAttractionQty}/>

                        <div className="flex flex-row space-x-4">
                            <div className="grid w-32 max-w-sm items-center text-center my-2">
                                {/* <Input className='w-24' type="number" placeholder="Attraction qty" value={attractionQty} onChange={handleAttractionQtyChange}/> */}
                                <Button variant={"outline"} className='w-32' onClick={() => setVehicleQty(vehicleQty + 1)}>+ Add Vehicle</Button>
                            </div>
                        </div>
                        <VehicleQty vehicleQty={vehicleQty} onDetailsChange={handleVehicleDetailsChange} onVehicleQtyChange={setVehicleQty}/>

                        <div className="flex flex-row space-x-4">
                            <div className="grid w-32 max-w-sm items-center text-center my-2">
                                {/* <Input className='w-24' type="number" placeholder="Attraction qty" value={attractionQty} onChange={handleAttractionQtyChange}/> */}
                                <Button variant={"outline"} className='w-32' onClick={() => setHotelQty(hotelQty + 1)}>+ Add Hotel</Button>
                            </div>
                        </div>
                        <HotelQty hotelQty={hotelQty} onDetailsChange={handleHotelDetailsChange} onHotelQtyChange={setHotelQty}/>

                        <div className="justify-center flex">
                            <Button type="submit" className='mt-4'>Add Package
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default AddPackage

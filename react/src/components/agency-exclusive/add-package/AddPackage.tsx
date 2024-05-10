import { useForm } from 'react-hook-form'
import { addPackage } from './utils/schema'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Required } from '@/components/ui/Custom/required'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import AttractionQty from './ProductQty/AttractionQty'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const AddPackage = () => {
    const [attractionQty, setAttractionQty] = useState<number>(0);
    const [details, setDetails] = useState<addPackage['details']>([]);

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

    const handleDetailsChange = (newDetails: addPackage['details']) => {
        setDetails(newDetails);
    };

    const onSubmit = async (values: addPackage) => {
        console.log(values);
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

                        <h1 className="text-xl mb-8 mt-6">Detail Package</h1>

                        <div className="flex flex-row space-x-4">
                            <div className="grid w-36 max-w-sm items-center gap-1.5">
                                <Label htmlFor="email">Attraction qty</Label>
                                {/* <Input className='w-24' type="number" placeholder="Attraction qty" value={attractionQty} onChange={handleAttractionQtyChange}/> */}
                                <Button variant={"outline"} className='w-32' onClick={() => setAttractionQty(attractionQty + 1)}>+ Add Attraction</Button>
                            </div>
                        </div>
                        <AttractionQty attractionQty={attractionQty} onDetailsChange={handleDetailsChange} onAttractionQtyChange={setAttractionQty}/>


                    </form>
                </Form>
            </div>
        </div>
    )
}

export default AddPackage

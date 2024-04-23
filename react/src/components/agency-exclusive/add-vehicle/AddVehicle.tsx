import { zodResolver } from '@hookform/resolvers/zod'
import React, { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { addVehicleSchema } from './utils/schema'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ProvinceCombobox } from '../add-attraction/ComboBox.tsx/ProvinceComboBox'
import { CityCombobox } from '../add-attraction/ComboBox.tsx/cityComboBox/CityCombobox'
import { KecamatanCombobox } from '../add-attraction/ComboBox.tsx/kecamatanCombobox/KecamatanCombobox'
import { KelurahanCombobox } from '../add-attraction/ComboBox.tsx/kelurahanCombobox/KelurahanCombobox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from '@/components/ui/button'

const AddVehicle = () => {
    const [imageUrl, setImageUrl] = useState('');
    const currentYear = new Date().getFullYear();
    const years: number[] = Array.from({ length: currentYear - 1949 }, (_, index) => currentYear - index);

    const form = useForm<z.infer<typeof addVehicleSchema>>({
        resolver: zodResolver(addVehicleSchema),
        defaultValues: {
            vehicle_code: "",
            vehicle_name : "",
            picture: undefined,
            area_1: "",
            area_2: "",
            area_3: "",
            area_4: "",
            vehicle_type : "",
            vehicle_brand : "",
            vehicle_seat : 0,
            vehicle_series : "",
            vehicle_model : "",
            vehicle_year : 2024,
            with_driver : false,
            address : "",
            qty : 0,
            promo_code: "",
            base_price: 0,
            promo_code_affiliate: ""
        }
    })

    const fileRef = form.register("picture");

    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result as string
            setImageUrl(result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleProvinceSelect = (province:string) => {
        form.setValue("area_1",province);
        console.log('province : ', province);
    };

    const handleCitySelect = (city:string) => {
        form.setValue("area_2",city);
    }

    const handleKecamatanSelect = (kecamatan:string) => {
        form.setValue("area_3",kecamatan);
    }

    const handleKelurahanSelect = (kelurahan:string) => {
        form.setValue("area_4",kelurahan);
    }

    const handleVehicleTypeChange = (newValue:string) => {
        form.setValue("vehicle_type", newValue);
    };

    const handleVehicleSeatChange = (newValue:number) => {
        form.setValue("vehicle_seat", newValue);
    };

    const handleSelectYear = () => {
        //form.setValue("vehicle_year");
        console.log('vehicle year : ');
    };

    const onSubmit = async (values: z.infer<typeof addVehicleSchema>) => {
        console.log(values);
    }

    return (
        <div className="min-h-50 w-50 p-0 sm:p-12">
            <div className="mx-auto max-w-2xl px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <h1 className="text-2xl font-bold mb-8 text-center">Add Vehicle</h1>
                        <FormField
                            control={form.control}
                            name="vehicle_code"
                            render={({ field }) => (
                                <FormItem className="custom-field">
                                    <FormLabel>{"Vehicle Code"}</FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <Input
                                            placeholder={"Vehilce Code"}
                                            {...field}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="picture"
                            render={() => (
                                <FormItem className="custom-field">
                                    <FormLabel>{"Picture"}</FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <Input
                                            id="picture"
                                            type="file"
                                            accept='.jpg, .jpeg, .png'
                                            {...fileRef}
                                            onChange={handleImageUpload}
                                        />
                                    </FormControl>
                                    {imageUrl && (
                                        <div>
                                            <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100%', marginTop: '10px' }} />
                                        </div>
                                    )}
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-row">
                                <FormField
                                    control={form.control}
                                    name="area_1"
                                    render={() => (
                                        <FormItem className="custom-field mt-4 mr-8 flex flex-col">
                                            <FormLabel>{"Province"}</FormLabel>
                                            <FormMessage />
                                            <FormControl>
                                                <ProvinceCombobox onSelectProvince={handleProvinceSelect}/>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="area_2"
                                    render={() => (
                                        <FormItem className="custom-field mt-4 flex flex-col">
                                            <FormLabel>{"City"}</FormLabel>
                                            <FormMessage />
                                            <FormControl>
                                                <CityCombobox onSelectCity={handleCitySelect} selectedProvince={form.watch("area_1")}/>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                        </div>

                        <div className="flex flex-row">
                            <FormField
                                control={form.control}
                                name="area_3"
                                render={() => (
                                    <FormItem className="custom-field mt-4 mr-8 flex flex-col">
                                        <FormLabel>{"District"}</FormLabel>
                                        <FormMessage />
                                        <FormControl>
                                            <KecamatanCombobox onSelectKecamatan={handleKecamatanSelect} selectedCity={form.watch("area_2")}/>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="area_4"
                                render={() => (
                                    <FormItem className="custom-field mt-4 flex flex-col">
                                        <FormLabel>{"Subdistrict"}</FormLabel>
                                        <FormMessage />
                                        <FormControl>
                                            <KelurahanCombobox onSelectKelurahan={handleKelurahanSelect} selectedKecamatan={form.watch("area_3")}/>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex flex-row">
                            <FormField
                                control={form.control}
                                name="vehicle_type"
                                render={() => (
                                    <FormItem className="custom-field mr-10">
                                        <FormLabel>{"Vehicle Type"}</FormLabel>
                                        <FormMessage />
                                        <FormControl>
                                            <Select
                                                onValueChange={(newValue) => form.setValue("vehicle_type", newValue)}>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Vehicle Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Car" onChange={() => handleVehicleTypeChange("Car")}>Car</SelectItem>
                                                    <SelectItem value="Motorcycle" onChange={() => handleVehicleTypeChange("Motorcycle")}>Motorcycle</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="vehicle_seat"
                                render={() => (
                                    <FormItem className="custom-field ml-3">
                                        <FormLabel>{"Vehicle Seat"}</FormLabel>
                                        <FormMessage />
                                        <FormControl>
                                            <Select onValueChange={(newValue) => form.setValue("vehicle_type", newValue)}>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Vehicle Seat" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="2" onChange={() => handleVehicleSeatChange(2)}>2 Seat</SelectItem>
                                                    <SelectItem value="4" onChange={() => handleVehicleSeatChange(4)}>4 Seat</SelectItem>
                                                    <SelectItem value="6" onChange={() => handleVehicleSeatChange(6)}>6 Seat</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex flex-row space-x-4">
                            <FormField
                                control={form.control}
                                name="vehicle_brand"
                                render={({ field }) => (
                                    <FormItem className="custom-field">
                                        <FormLabel>{"Vehicle Brand"}</FormLabel>
                                        <FormMessage />
                                        <FormControl>
                                            <Input
                                                placeholder={"Input Vehicle Brand"}
                                                {...field}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="vehicle_series"
                                render={({ field }) => (
                                    <FormItem className="custom-field">
                                        <FormLabel>{"Vehicle Series"}</FormLabel>
                                        <FormMessage />
                                        <FormControl>
                                            <Input
                                                placeholder={"Input Vehicle Series"}
                                                {...field}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="vehicle_model"
                                render={({ field }) => (
                                    <FormItem className="custom-field">
                                        <FormLabel>{"Vehicle Model"}</FormLabel>
                                        <FormMessage />
                                        <FormControl>
                                            <Input
                                                placeholder={"Input Vehicle Model"}
                                                {...field}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* <YearSelector onSelectYear={handleSelectYear} /> */}
                        <FormField
                            control={form.control}
                            name="vehicle_year"
                            render={() => (
                                <FormItem className="custom-field">
                                    <FormLabel>{"Vehicle Year"}</FormLabel>
                                    <FormMessage />
                                    <FormControl>
                                        <Select onValueChange={(newValue) => form.setValue("vehicle_year", parseInt(newValue, 10))}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Year" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                    {years.map((year) => (
                                                        <SelectItem
                                                            key={year}
                                                            value={year.toString()}
                                                            onSelect={() => handleSelectYear()}
                                                        >
                                                            {year}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="justify-center flex">
                            <Button type="submit" className='mt-6'>Add Attraction Product
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default AddVehicle

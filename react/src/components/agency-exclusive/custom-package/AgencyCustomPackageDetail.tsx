import axiosClient from "@/axios.client";
import { ChangeEvent, useEffect, useState } from "react";
import HashLoader from "react-spinners/HashLoader"
import { Package, PackageDs } from "./interface/interface";
// import { HotelH } from "../main-dashboard/utils/interfaceHotel";
// import { VehicleH } from "../main-dashboard/utils/interfaceVehicle";
// import { AttractionH } from "../main-dashboard/utils/interfaceAttraction";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import RejectCustomPackageAlert from "./sub-component/RejectCustomPackageAlert";
import AcceptCustomPackageAlert from "./sub-component/AcceptCustomPackageAlert";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/utils/priceFormating";

interface PackageDataRow {
    package_h_id : string,
    hotel_name : string,
    vehicle_name : string,
    attraction_name : string,
    start_dt : string,
    end_dt : string,
    price : number,
}


const AgencyCustomPackageDetail = ({ package_h_id }: { package_h_id: number }) => {
    const [loading, setLoading] = useState(true);
    const [customPackage, setCustomPackage] = useState<Package>({} as Package);
    // const [hotel, setHotel] = useState<HotelH>();
    // const [vehicle, setVehicle] = useState<VehicleH>();
    // const [attraction, setAttraction] = useState<AttractionH>();
    const [packageDataRows, setPackageDataRows] = useState<PackageDataRow[]>([]);
    const { t } = useTranslation();
    const [newPrice, setNewPrice] = useState(0);
    const [totalDays, setTotalDays] = useState(0);
    const [boolPrice, setBoolPrice] = useState(true);
    const [boolDays, setBoolDays] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.post('v1/GetPackageDataById', { package_h_id: package_h_id });
                setCustomPackage(response.data.data);
                const packageData: PackageDs[] = response.data.data.package_ds;
    
                const fetchDetails = packageData.map(async (packageD) => {
                    let hotel_name = '';
                    let vehicle_name = '';
                    let attraction_name = '';
                    let price = 0;
    
                    if (packageD.ref_hotel_id != null) {
                        const responseHotel = await axiosClient.post('v1/GetHotelById', { ref_hotel_id: packageD.ref_hotel_id });
                        hotel_name = responseHotel.data.hotel.hotel_name;
                        price = responseHotel.data.base_price;
                        //setHotel(responseHotel.data);
    
                    } else if (packageD.ref_vehicle_id != null) {
                        const responseVehicle = await axiosClient.post('v1/GetVehicleById', { ref_vehicle_id: packageD.ref_vehicle_id });
                        vehicle_name = responseVehicle.data.vehicle.vehicle_name;
                        price = responseVehicle.data.base_price;
                        //setVehicle(responseVehicle.data);
    
                    } else if (packageD.ref_attraction_id != null) {
                        const responseAttraction = await axiosClient.post('v1/GetAttractionById', { ref_attraction_id: packageD.ref_attraction_id });
                        attraction_name = responseAttraction.data.attraction.attraction_name;
                        price = responseAttraction.data.base_price;
                        //setAttraction(responseAttraction.data);                       
                    }
    
                    return {
                        package_h_id: packageD.package_h_id ?? '',
                        hotel_name,
                        vehicle_name,
                        attraction_name,
                        start_dt: packageD.start_dt ?? '',
                        end_dt: packageD.end_dt ?? '',
                        price,
                    };
                });
                const details = await Promise.all(fetchDetails);
                setPackageDataRows(details);
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
            }
            fetchData();
      }, [package_h_id])

    //   const formatPrice = (price: number): string => {
    //     if (typeof price !== 'undefined' && !isNaN(price)) {
    //       // Format the price using toLocaleString
    //       return price.toLocaleString('id-ID', {
    //         style: 'currency',
    //         currency: 'IDR'
    //       });
    //     } else {
    //       // Handle undefined or non-numeric inputs
    //       return 'N/A'; // Or any default value or error message you prefer
    //     }
    //   };

      const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setNewPrice(event.target.valueAsNumber);
        setBoolPrice(false);

        if(event.target.valueAsNumber <= 0 || isNaN(event.target.valueAsNumber)) {
            setBoolPrice(true);
        }
    };

    const handleChange2 = (event: ChangeEvent<HTMLInputElement>) => {
        setTotalDays(event.target.valueAsNumber);
        setBoolDays(false);

        if(event.target.valueAsNumber <= 0 || isNaN(event.target.valueAsNumber) ) {
            setBoolDays(true);
        }
    };

    const handleDisableButton = (priceFill : boolean, totalDaysFill : boolean) => {
        if(!priceFill && !totalDaysFill) {
            return false;
        } else {
            return true;
        }
    }

    return (
    <div>
        {loading ? (
        <div className="flex justify-center items-center min-h-screen">
            <HashLoader size={50} color={"#123abc"} loading={loading} />
        </div>
        ) : (
        <div className="shadow-lg sm:rounded-3xl">
            {/* Header */}
            <div className='p-5 text-xl flex flex-row justify-between'>
              <div className="flex flex-row">
                <div className="">
                  {t('Custom Package Code')}
                  <br />
                  {t('Custom Package Status')}
                  <br />
                  {t('Customer Name')}
                  <br />
                  {t('Customer Phone')}
                  <br />
                  {t('Customer Email')}
                </div>
                <div className="ml-4">
                  : {customPackage.package_code}
                  <br />
                  : {customPackage.custom_status}
                  <br />
                  : {customPackage.customer_name}
                  <br />
                  : {customPackage.customer_phone}
                  <br />
                  : {customPackage.customer_email}
                </div>
              </div>
            </div>
              
            {/* Table */}
            <div className="p-5 text-xl flex flex-col">
              <hr className='border-2' />
              <br />
              <div className="">
                <Table>
                  <TableCaption></TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('Product')}</TableHead>
                      <TableHead className="w-36">{t('From')}</TableHead>
                      <TableHead>{t('To')}</TableHead>
                      {/* <TableHead>{t('Amount')}</TableHead> */}
                      <TableHead className="text-center">{t('Base Price')}</TableHead>
                      {/* <TableHead className="text-right">{t('Sub Total')}</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {packageDataRows && packageDataRows.length > 0 ? (
                        packageDataRows.map((dataRow, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    {dataRow.hotel_name || dataRow.vehicle_name || dataRow.attraction_name || "N/A"}
                                </TableCell>
                                <TableCell>
                                    {dataRow.start_dt?.split(" ")[0] || "N/A"}
                                </TableCell>
                                <TableCell>
                                    {dataRow.end_dt?.split(" ")[0] || "N/A"}
                                </TableCell>
                                    <TableCell className="text-center">
                                        {formatPrice(dataRow.price)}
                                    </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center">
                                {t('No package details available')}
                            </TableCell>
                        </TableRow>
                    )}
                    <TableRow>
                        <TableCell>
                        </TableCell>
                    </TableRow>
                  </TableBody>
                  <TableFooter>
                    <TableRow className='bg-slate-500 hover:bg-slate-500 text-white'>
                      {/* <TableCell colSpan={5} className='font-bold'>{t('Total Price')}</TableCell>
                      <TableCell className="text-right font-bold">{formatPrice(order.total_price)}</TableCell> */}
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </div>

            {customPackage.custom_status === 'NEW' && (
                <div className="flex justify-center items-center flex-col">
                    <div className="flex justify-center items-center flex-col">
                        <p className="font-bold">{t('If you want to accept this package, please input the')}</p>
                        <p className="font-bold text-red-500">{t('New Total Price')}</p>
                    </div>
                    <div className="w-36 mt-4">
                        <Input
                            type="number"
                            onChange={handleChange}
                            className="border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                            >
                        </Input>
                    </div>
                    <div className="mt-4 flex justify-center items-center flex-col">
                        <p className="font-bold">{t('If you want to accept this package, please input the')}</p>
                        <p className="font-bold text-red-500">{t('Total Days')}</p>
                    </div>
                    <div className="w-36 mt-4">
                        <Input
                            type="number"
                            onChange={handleChange2}
                            className="border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                            >
                        </Input>
                    </div>
                </div>
            )}

            <div className="text-xl flex flex-col p-3">
                {customPackage.custom_status === 'APV' && (
                    <div className="flex justify-center items-center flex-col">
                        <div>
                            <p className="font-bold">{t('This custom package has been approved, please check for the order details')}</p>
                        </div>
                    </div>
                )}

                {customPackage.custom_status === 'RJT' && (
                    <div className="flex justify-center items-center flex-col">
                        <div>
                            <p className="font-bold">{t('This custom package has been rejected')}</p>
                        </div>
                    </div>
                )}
                
                {customPackage.custom_status === 'NEW' && (
                    <div className="flex justify-center m-2 p-2 mt-3">
                        <div className="flex justify-center items-center space-x-6">
                            <RejectCustomPackageAlert apiPath='/v1/RejectCustomPackage' id={package_h_id} ></RejectCustomPackageAlert>
                            <AcceptCustomPackageAlert apiPath='/v1/ApproveCustomPackage' id={package_h_id} newPrice={newPrice} totalDays={totalDays} disabled={handleDisableButton(boolPrice, boolDays)}></AcceptCustomPackageAlert>
                        </div>
                    </div>
                )}
            </div>
        </div>
        )}
    </div>
    )
}

export default AgencyCustomPackageDetail
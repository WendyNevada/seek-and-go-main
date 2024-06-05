import axiosClient from "@/axios.client";
import { OrderD } from "@/components/agency-exclusive/main-dashboard/utils/interface";
import { AttractionH } from "@/components/agency-exclusive/main-dashboard/utils/interfaceAttraction";
import { HotelH } from "@/components/agency-exclusive/main-dashboard/utils/interfaceHotel";
import { VehicleH } from "@/components/agency-exclusive/main-dashboard/utils/interfaceVehicle";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { useLogin } from "@/context/LoginContext";
import { urlConstant } from "@/urlConstant";
import axios, { AxiosError } from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import CancelOrderAlert from "./sub-components/CancelOrderAlert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AgencyPayment } from "../../interface/interface";
import OrderGenericAlert from "./sub-components/OrderGenericAlert";
import { Input } from "@/components/ui/input";
import RatingDialog from "./sub-components/RatingDialog";

interface OrderDataRow {
    order_h_id : number,
    hotel_name : string,
    vehicle_name : string,
    attraction_name : string,
    start_dt : string,
    end_dt : string,
    qty : number,
    price : number,
    total_price : number
}

interface RatingData {
  id: number;
  product_type: string;
}

const MyOrderDetail = ({ order_h_id }: { order_h_id: number }) => {
  const { t } = useTranslation();
  const [order, setOrder] = useState<OrderD>({} as OrderD);
  const [hotel, setHotel] = useState<HotelH>();
  const [vehicle, setVehicle] = useState<VehicleH>();
  const [attraction, setAttraction] = useState<AttractionH>();
  const { user } = useLogin();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const enviUrl = import.meta.env.VITE_API_BASE_URL;
  const [pictUrl, setPictUrl] = useState('');
  const [selectedPaymentType, setSelectedPaymentType] = useState<string | null>(null);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [agencyPaymentId, setAgencyPaymentId] = useState(0);
  const [accountNo, setAccountNo] = useState<string | null>(null);
  const [accountName, setAccountName] = useState<string | null>(null);
  const [qrisImg, setqrisImg] = useState<string | null>(null);
  const [agencyPayment, setAgencyPayment] = useState<AgencyPayment[]>();
  const [imageUrl, setImageUrl] = useState<string|undefined>('');
  const [picture, setPicture] = useState<File | null>();
  const [orderDataRows, setOrderDataRows] = useState<OrderDataRow[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productsRating, setProductsRating] = useState<RatingData[]>([]);
  const [isGiveRating, setIsGiveRating] = useState(0);
  const [buttonRate, setButtonRate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axiosClient.post('v1/GetOrderById', { order_h_id: order_h_id });
            setOrder(response.data);
            const orderData: OrderD = response.data;

            if(response.status === 200) {
                const responseTrx = await axiosClient.post('v1/GetTrxByOrderHId', {order_h_id : order_h_id});
                setIsGiveRating(responseTrx.data.trx.is_given_rating); 
            }

            const fetchDetails = orderData.order_ds.map(async (orderD) => {
                let hotel_name = '';
                let vehicle_name = '';
                let attraction_name = '';
                let price = 0;

                if (orderD.ref_hotel_id != null) {
                    const responseHotel = await axiosClient.post('v1/GetHotelById', { ref_hotel_id: orderD.ref_hotel_id });
                    hotel_name = responseHotel.data.hotel.hotel_name;
                    price = responseHotel.data.base_price;
                    setHotel(responseHotel.data);
                    setPictUrl(responseHotel.data.picture_url)

                    const rateData: RatingData[] = [{
                      id: orderD.ref_hotel_id ?? 0,
                      product_type: 'hotel'
                    },];

                    const fetchRate = rateData.map((rating: RatingData) => {
                      return {
                        ...rating,
                        id: rateData[0].id ?? 0,
                        product_type: rateData[0].product_type,
                      };
                    });
                    
                    Promise.all(fetchRate);
                    setProductsRating(fetchRate);

                } else if (orderD.ref_vehicle_id != null) {
                    const responseVehicle = await axiosClient.post('v1/GetVehicleById', { ref_vehicle_id: orderD.ref_vehicle_id });
                    vehicle_name = responseVehicle.data.vehicle.vehicle_name;
                    price = responseVehicle.data.base_price;
                    setVehicle(responseVehicle.data);
                    setPictUrl(responseVehicle.data.picture_url)

                    const rateData: RatingData[] = [{
                      id: orderD.ref_vehicle_id ?? 0,
                      product_type: 'vehicle'
                    },];

                    const fetchRate = rateData.map((rating: RatingData) => {
                      return {
                        ...rating,
                        id: rateData[0].id ?? 0,
                        product_type: rateData[0].product_type,
                      };
                    });
                    
                    Promise.all(fetchRate);
                    setProductsRating(fetchRate);

                } else if (orderD.ref_attraction_id != null) {
                    const responseAttraction = await axiosClient.post('v1/GetAttractionById', { ref_attraction_id: orderD.ref_attraction_id });
                    attraction_name = responseAttraction.data.attraction.attraction_name;
                    price = responseAttraction.data.base_price;
                    setAttraction(responseAttraction.data);
                    setPictUrl(responseAttraction.data.picture_url)

                    const rateData: RatingData[] = [{
                      id: orderD.ref_attraction_id ?? 0,
                      product_type: 'attraction'
                    },];

                    const fetchRate = rateData.map((rating: RatingData) => {
                      return {
                        ...rating,
                        id: rateData[0].id ?? 0,
                        product_type: rateData[0].product_type,
                      };
                    });
                    
                    Promise.all(fetchRate);
                    setProductsRating(fetchRate);
                    
                }

                const responsePayment = await axiosClient.post('v1/GetAllAgencyPaymentByAgencyId', { agency_id: response.data.agency_id });
                setAgencyPayment(responsePayment.data.data);

                return {
                    order_h_id: orderData.order_h_id,
                    hotel_name,
                    vehicle_name,
                    attraction_name,
                    start_dt: orderD.start_dt,
                    end_dt: orderD.end_dt,
                    qty: orderD.qty,
                    price,
                    total_price: orderD.price || 0
                };
            });
            const details = await Promise.all(fetchDetails);
            setOrderDataRows(details);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
        }
        fetchData();
  }, [order_h_id])

  const formatPrice = (price: number): string => {
    if (typeof price !== 'undefined' && !isNaN(price)) {
      // Format the price using toLocaleString
      return price.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR'
      });
    } else {
      // Handle undefined or non-numeric inputs
      return 'N/A'; // Or any default value or error message you prefer
    }
  };

  const filteredAgencyPayments = agencyPayment?.filter(payment => payment.payment_type === selectedPaymentType);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>, setImageUrl: React.Dispatch<React.SetStateAction<string | undefined>>) => {
    const file = event.target.files && event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        const result = reader.result as string
        setImageUrl(result);
    };

    if (file) {
        reader.readAsDataURL(file);
    }
    else {
        setImageUrl(undefined);
    }
};

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(event, setImageUrl);
    setPicture(event.target.files?.[0]);
};

  const handleOpenRatingModal = () => {
    setIsEditModalOpen(true);
  }

  const handleAfterRate = () => {
    setIsEditModalOpen(false);
    setButtonRate(true);
  }

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <HashLoader size={50} color={"#123abc"} loading={loading} />
        </div>
      ) : (
        <>
          <div className='shadow-lg sm:rounded-3xl'>
            {/* Header */}
            <div className='p-5 text-xl flex flex-row justify-between'>
              <div className="flex flex-row">
                <div className="">
                  {t('Order No')}
                  <br />
                  {t('Order Status')}
                  <br />
                  {t('Total Price')}
                  <br />
                  {t('Agency Name')}
                </div>
                <div className="ml-4">
                  : {order.order_no}
                  <br />
                  : {order.order_status}
                  <br />
                  : {formatPrice(order.total_price)}
                  <br />
                  : {order.agency_name}
                </div>
              </div>
              <div>
                {order.order_ds[0].package_h_id == null && (
                  <img src={enviUrl + pictUrl} alt="Loading..." className="w-36 h-24 rounded-md" />
                )}
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
                      <TableHead>{t('Amount')}</TableHead>
                      <TableHead className="text-center">{t('Price')}</TableHead>
                      <TableHead className="text-right">{t('Sub Total')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderDataRows && orderDataRows.length > 0 ? (
                        orderDataRows.map((dataRow, index) => (
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
                                {
                                    order.order_ds[0].package_h_id == null ? (
                                        <>
                                            <TableCell>
                                                {dataRow.qty || "N/A"}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {formatPrice(dataRow.price)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {formatPrice(dataRow.total_price)}
                                            </TableCell>
                                        </>
                                    ):(
                                        <>
                                            <TableCell>
                                                -
                                            </TableCell>
                                            <TableCell className="text-center">
                                                -
                                            </TableCell>
                                            <TableCell className="text-right">
                                                -
                                            </TableCell>
                                        </>
                                    )
                                }
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center">
                                No order details available.
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
                      <TableCell colSpan={5} className='font-bold'>{t('Total Price')}</TableCell>
                      <TableCell className="text-right font-bold">{formatPrice(order.total_price)}</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </div>

            {/* Dibawah tabel */}

            {order.order_status === 'NEW' && (
              <div className="flex justify-center items-center">
                <p className="font-bold">{t('Please wait for the agency to approve your order, or you can cancel it')}</p>
              </div>
            )}

            {order.order_status === 'CAN' && (
              <div className="flex justify-center items-center">
                <p className="font-bold">{t('This order is canceled')}</p>
              </div>
            )}

            {order.order_status === 'RJT' && (
              <div className="flex justify-center items-center">
                <p className="font-bold">{t('This order is rejected')}</p>
              </div>
            )}

            {order.order_status === 'CPY' && (
              <div className="flex justify-center items-center">
                <p className="font-bold">{t('Please wait for the agency to confirm your payment')}</p>
              </div>
            )}

            {order.order_status === 'APV' && (
              <div className="p-5 text-xl flex flex-col">
                <hr className='border-2' />
              </div>
            )}

            {order.order_status === 'RTP' && (
              <div className="p-5 text-xl flex flex-col">
                <hr className='border-2' />
              </div>
            )}

            {order.order_status === 'PAY' && (
              <div className="flex justify-center items-center">
                <p className="font-bold">{t('The payment for this order has been confirmed, please wait for the agency to contact you')}</p>
              </div>
            )}

            {order.order_status === 'FIN' && (
              <div className="flex justify-center items-center">
                <p className="font-bold">{t('This order has been completed, thank you')}</p>
              </div>
            )}

            <div className="flex justify-center m-2 p-2">


                {order.order_status === 'NEW' && (
                <div className="flex justify-center items-center">
                    <CancelOrderAlert apiPath='/v1/CancelOrderCustomer' id={order_h_id} role={user?.role || ''}></CancelOrderAlert>
                </div>
                )}

                {order.order_status === 'APV' && (
                <div>
                    <div className="flex justify-center items-center">
                        <div className="flex flex-col space-y-2 items-center"> {/* Center align all child elements */}

                            <p className="font-bold">{t('Payment Methods')}</p>
                            <Select onValueChange={(value) => {
                            setSelectedPaymentType(value);
                            setSelectedBank(null);
                            setAccountNo(null);
                            setAccountName(null);
                            setqrisImg(null);
                            }}>
                            <SelectTrigger className="w-[20em]">
                                <SelectValue placeholder={t('Payment Type')}>{selectedPaymentType ?? t('Payment Type')}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Bank Transfer">{t('Bank Transfer')}</SelectItem>
                                <SelectItem value="QRIS">{t('QRIS')}</SelectItem>
                            </SelectContent>
                            </Select>

                            <p className="font-bold">{t('Select Bank')}</p>
                                <Select
                                value={selectedBank ?? undefined}
                                onValueChange={(value) => {
                                    setSelectedBank(value);
                                    const selectedPayment = filteredAgencyPayments?.find(payment =>
                                    `${payment.bank_name} - ${payment.account_name}` === value
                                    );
                                    setAgencyPaymentId(selectedPayment?.agency_payment_id ?? 0);
                                    setAccountNo(selectedPayment?.account_no ?? null);
                                    setAccountName(selectedPayment?.account_name ?? null);
                                    setqrisImg(selectedPayment?.image_url ?? null);
                                }}
                                >
                                <SelectTrigger className="w-[20em]">
                                    <SelectValue placeholder={t('Select Bank')}>{selectedBank ?? t('Select Bank')}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredAgencyPayments?.map((agencyPaymentItem) => (
                                    <SelectItem
                                        key={agencyPaymentItem.agency_payment_id}
                                        value={`${agencyPaymentItem.bank_name} - ${agencyPaymentItem.account_name}`}>
                                        {agencyPaymentItem.bank_name} - {agencyPaymentItem.account_name}
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>

                            {selectedPaymentType === 'Bank Transfer' && (
                            <>
                                <div className="flex flex-col space-y-2 items-center">
                                <p className="font-bold ml-3">{t('Account Number')}</p>
                                <div className="flex justify-center items-center mt-3">
                                    <p className="font-mono">{accountNo ?? "N/A"}</p>
                                </div>
                                <p className="font-bold ml-3">{t('Account Name')}</p>
                                <div className="flex justify-center items-center mt-3">
                                    <p className="font-mono">{accountName ?? "N/A"}</p>
                                </div>
                                </div>

                                <div className="flex justify-center items-center mt-4">
                                <p className="font-bold ml-3">{t('Please Transfer To The Following Account')}</p>
                                </div>

                                <div className="flex justify-center items-center mt-4">
                                <p className="font-bold ml-3 text-red-500">{t('Only click Confirm Payment Button After You Have Transfered The Payment')}</p>
                                </div>
                            </>
                            )}
                        </div>
                    </div>

                {selectedPaymentType === 'QRIS' && (
                <>

                    <div className="mt-7">

                    {qrisImg && (
                        <div>
                            <img src={enviUrl + qrisImg} alt="Loading..." className="w-full h-full object-cover" />
                        </div>
                    )}

                    {qrisImg === null && (
                        <div className="flex justify-center items-center">
                        <p className="font-bold">{t('Please pick QRIS Bank')}</p>
                        </div>
                    )}
                    </div>

                    {qrisImg && (
                        <div className="flex justify-center items-center mt-4">
                            <p className="font-bold ml-3 text-red-500">{t('Only click Confirm Payment Button After You Have Paid')}</p>
                        </div>
                    )}

                </>)}

                {selectedPaymentType && selectedBank && (
                <div>
                    <div className="flex justify-center items-center mt-7">
                      <p className="font-bold">{t('Upload Proof of Payment')}</p>
                    </div>
                    <div className="flex justify-center items-center mt-4">
                    <Input
                        id="picture"
                        type="file"
                        accept='.jpg, .jpeg, .png'
                        onChange={handleChange}
                    />
                    </div>
                    {imageUrl && (
                        <div>
                            <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100%', marginTop: '10px' }} />
                        </div>
                    )}
                    </div>
                )}

                    <div className="flex justify-center items-center mt-7">
                      <OrderGenericAlert apiPath='/v1/CustPaidOrder' id={order_h_id} selectedPaymentType={selectedPaymentType}
                        selectedBank={selectedBank} image={picture}></OrderGenericAlert>
                    </div>
                </div>
                )}

                {order.order_status === 'RTP' && (
                <div>
                    <div className="flex justify-center items-center mb-4">
                        <p className="font-bold text-red-500">{t('Agency Has Requested You To Retry Payment')}</p>
                    </div>
                    <div className="flex justify-center items-center">
                        <div className="flex flex-col space-y-2 items-center"> {/* Center align all child elements */}

                            <p className="font-bold">{t('Payment Methods')}</p>
                            <Select onValueChange={(value) => {
                            setSelectedPaymentType(value);
                            setSelectedBank(null);
                            setAccountNo(null);
                            setAccountName(null);
                            setqrisImg(null);
                            }}>
                            <SelectTrigger className="w-[20em]">
                                <SelectValue placeholder={t('Payment Type')}>{selectedPaymentType ?? t('Payment Type')}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Bank Transfer">{t('Bank Transfer')}</SelectItem>
                                <SelectItem value="QRIS">{t('QRIS')}</SelectItem>
                            </SelectContent>
                            </Select>

                            <p className="font-bold">{t('Select Bank')}</p>
                                <Select
                                value={selectedBank ?? undefined}
                                onValueChange={(value) => {
                                    setSelectedBank(value);
                                    const selectedPayment = filteredAgencyPayments?.find(payment =>
                                    `${payment.bank_name} - ${payment.account_name}` === value
                                    );
                                    setAgencyPaymentId(selectedPayment?.agency_payment_id ?? 0);
                                    setAccountNo(selectedPayment?.account_no ?? null);
                                    setAccountName(selectedPayment?.account_name ?? null);
                                    setqrisImg(selectedPayment?.image_url ?? null);
                                }}
                                >
                                <SelectTrigger className="w-[20em]">
                                    <SelectValue placeholder={t('Select Bank')}>{selectedBank ?? t('Select Bank')}</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredAgencyPayments?.map((agencyPaymentItem) => (
                                    <SelectItem
                                        key={agencyPaymentItem.agency_payment_id}
                                        value={`${agencyPaymentItem.bank_name} - ${agencyPaymentItem.account_name}`}>
                                        {agencyPaymentItem.bank_name} - {agencyPaymentItem.account_name}
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>

                            {selectedPaymentType === 'Bank Transfer' && (
                            <>
                                <div className="flex flex-col space-y-2 items-center">
                                <p className="font-bold ml-3">{t('Account Number')}</p>
                                <div className="flex justify-center items-center mt-3">
                                    <p className="font-mono">{accountNo ?? "N/A"}</p>
                                </div>
                                <p className="font-bold ml-3">{t('Account Name')}</p>
                                <div className="flex justify-center items-center mt-3">
                                    <p className="font-mono">{accountName ?? "N/A"}</p>
                                </div>
                                </div>

                                <div className="flex justify-center items-center mt-4">
                                <p className="font-bold ml-3">{t('Please Transfer To The Following Account')}</p>
                                </div>

                                <div className="flex justify-center items-center mt-4">
                                <p className="font-bold ml-3 text-red-500">{t('Only click Confirm Payment Button After You Have Transfered The Payment')}</p>
                                </div>
                            </>
                            )}
                        </div>
                    </div>

                {selectedPaymentType === 'QRIS' && (
                <>

                    <div className="mt-7">

                    {qrisImg && (
                        <div>
                            <img src={enviUrl + qrisImg} alt="Loading..." className="w-full h-full object-cover" />
                        </div>
                    )}

                    {qrisImg === null && (
                        <div className="flex justify-center items-center">
                        <p className="font-bold">{t('Please pick QRIS Bank')}</p>
                        </div>
                    )}
                    </div>

                    {qrisImg && (
                        <div className="flex justify-center items-center mt-4">
                            <p className="font-bold ml-3 text-red-500">{t('Only click Confirm Payment Button After You Have Paid')}</p>
                        </div>
                    )}

                </>)}

                {selectedPaymentType && selectedBank && (
                <div>
                    <div className="flex justify-center items-center mt-7">
                      <p className="font-bold">{t('Upload Proof of Payment')}</p>
                    </div>
                    <div className="flex justify-center items-center mt-4">
                    <Input
                        id="picture"
                        type="file"
                        accept='.jpg, .jpeg, .png'
                        onChange={handleChange}
                    />
                    </div>
                    {imageUrl && (
                        <div>
                            <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100%', marginTop: '10px' }} />
                        </div>
                    )}
                    </div>
                )}

                    <div className="flex justify-center items-center mt-7">
                    {/* <Button className='bg-blue-500 p-2 hover:bg-blue-700 px-4 w-30 mb-3' disabled={!selectedPaymentType || !selectedBank} >{t('Confirm Payment')}</Button> */}
                    <OrderGenericAlert apiPath='/v1/CustPaidOrder' id={order_h_id} selectedPaymentType={selectedPaymentType}
                        selectedBank={selectedBank} image={picture}></OrderGenericAlert>
                    </div>
                </div>
                )}

                {order.order_status === 'FIN' && order.order_ds[0].package_h_id === null && isGiveRating === 0 && (
                    <div className="flex justify-center items-center mt-1 mb-3">
                      <Button variant="primary" className="bg-yellow-500 p-2 hover:bg-yellow-700 px-4 w-28" onClick={() => handleOpenRatingModal()} disabled={buttonRate}>{t('Give Rating')}</Button>
                      <RatingDialog isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} products={productsRating} order_h_id={order_h_id} onSave={() => handleAfterRate()}/>
                    </div>
                )}

            </div>
          </div>
        </>
      )}
    </>
  )
}

export default MyOrderDetail

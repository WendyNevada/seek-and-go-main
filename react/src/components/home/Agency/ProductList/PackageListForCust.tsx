import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Package } from '@/components/agency-exclusive/product-dashboard/utils/ProductModel';
import HashLoader from "react-spinners/HashLoader";
import axiosClient from "@/axios.client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';


const PackageListForCust = ({agency_id} : {agency_id: number}) => {
    const { t } = useTranslation();
    const [packages, setPackages] = useState<Package[]>([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect( () => {
        const fetchPackage =  async () => {
            try {
                const response = await axiosClient.post('v1/GetActivePackageHByAgencyId', {
                    agency_id: agency_id
                });
                setPackages(response.data.data);
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
            finally {
                setLoading(false);
            }
        }

        fetchPackage();
    }, [agency_id]);

    const selectItem = (id : number) => {
        navigate(`/Customer/PackageDetail/${id}`);
    }

    return (
        <div>
           {loading ? (
            <div className="flex justify-center items-center min-h-screen">
                <HashLoader size={50} color={"#123abc"} loading={loading} />
            </div>
            ) : (
                packages.reduce((rows: JSX.Element[][], pkg, index) => {
                    if (index % 4 === 0) {
                        rows.push([]);
                    }
                    rows[rows.length - 1].push(
                        <div key={pkg.package_h_id} className='flex-1'>
                            <Card className='w-64 shadow-lg mt-10 mr-16 hover:cursor-pointer' onClick={() => selectItem(pkg.package_h_id)}>
                                <CardHeader>
                                    <CardTitle className='w-[200px] truncate min-h-8'>{pkg.package_name}</CardTitle>
                                    <CardDescription className="truncate">{pkg.description}</CardDescription>
                                </CardHeader>
                                <CardContent className='flex-1'>
                                    <p>{t('Package Code')}: {pkg.package_code}</p>
                                    <p>{t('Price')}: Rp.{pkg.package_price}</p>
                                    <p>{t('Quantity')}: {pkg.qty}</p>
                                    <p>{t('Total Days')}: {pkg.total_days}</p>
                                </CardContent>
                                <CardFooter>
                                    {/* <Button variant='primary' onClick={() => onEditPackage(pkg.package_h_id)}>
                                        {<EditIcon />}
                                    </Button> */}
                                </CardFooter>
                            </Card>
                        </div>
                    );
                    return rows;
                }, []).map((row, index) => (
                    <div key={index} className='flex flex-row justify-left w-64'>
                        {row.map((card, i) => (
                            <div key={i} className='flex-1'>
                                {card}
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    )
}

export default PackageListForCust

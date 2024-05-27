import axiosClient from '@/axios.client';
import { useLogin } from '@/context/LoginContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { AlertDialogProduct } from '../ProductComponent/DeleteProductAlert';
import { useNavigate } from 'react-router-dom';
import { urlConstant } from '@/urlConstant';
import { Skeleton } from '@/components/ui/skeleton';

interface Package {
    package_h_id: number;
    package_code: string;
    agency_id: number;
    customer_id: number | null;
    package_name: string;
    description: string;
    is_custom: number;
    custom_status: string | null;
    package_price: number;
    is_active: number;
    qty: number;
    total_days: number;
    created_at: string;
    updated_at: string;
}

const PackageList = () => {
    const { t } = useTranslation();
    const { user } = useLogin();
    const [packages, setPackages] = useState<Package[]>([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect( () => {
        const fetchPackage =  async () => {
            try {
                const response = await axiosClient.post('v1/GetActivePackageHByAgencyId', {
                    agency_id: user?.agency_id
                });
                console.log(response.data);
                setPackages(response.data.data);
                setLoading(false);
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchPackage();
    }, []);

    const onEditPackage = (packageId: number) => {
        // navigate(`/Agency/EditPackage/${packageId}`);
        console.log('edit package : ', packageId);
        navigate(urlConstant.EditPackage + `/${packageId}`)
    }

    const renderSkeleton = () => (
        <div className="flex flex-col space-y-3 mx-8">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    );

    return (
        <div className='mt-2 justify-left'>
            {loading ? (
                <div className='flex flex-wrap'>
                    {Array(4).fill(0).map((_, index) => (
                        <div key={index} className='flex-1'>
                            {renderSkeleton()}
                        </div>
                    ))}
                </div>
            ) : (
                packages.reduce((rows: JSX.Element[][], pkg, index) => {
                    if (index % 4 === 0) {
                        rows.push([]);
                    }
                    rows[rows.length - 1].push(
                        <div key={pkg.package_h_id} className='flex-1'>
                            <Card className='w-64 shadow-lg mt-10 mr-16'>
                                <CardHeader>
                                    <CardTitle className='w-[200px] truncate'>{pkg.package_name}</CardTitle>
                                    <CardDescription>{pkg.description}</CardDescription>
                                </CardHeader>
                                <CardContent className='flex-1'>
                                    <p>{t('Package Code')}: {pkg.package_code}</p>
                                    <p>{t('Price')}: Rp.{pkg.package_price}</p>
                                    <p>{t('Quantity')}: {pkg.qty}</p>
                                    <p>{t('Total Days')}: {pkg.total_days}</p>
                                </CardContent>
                                <CardFooter>
                                    <Button variant='primary' onClick={() => onEditPackage(pkg.package_h_id)}>
                                        {<EditIcon />}
                                    </Button>
                                    <AlertDialogProduct apiPath='/v1/DeactivatePackageAgency' Id={pkg.package_h_id} param='package_h_id'/>
                                    {/* Implement deletion logic here */}
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

export default PackageList

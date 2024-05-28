import axiosClient from '@/axios.client';
import { Package } from '@/components/agency-exclusive/product-dashboard/utils/ProductModel';
import { useLogin } from '@/context/LoginContext';
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const DisplayPackage = () => {
    const { t } = useTranslation();
    const { user } = useLogin();
    const [packages, setPackages] = useState<Package[]>([]);
    const navigate = useNavigate();

    useEffect( () => {
        const fetchPackage =  async () => {
            try {
                const response = await axiosClient.post('v1/GetActivePackageHByAgencyId', {
                    agency_id: user?.agency_id
                });
                console.log(response.data);
                setPackages(response.data.data);
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchPackage();
    }, []);

  return (
    <div>DisplayPackage</div>
  )
}

export default DisplayPackage

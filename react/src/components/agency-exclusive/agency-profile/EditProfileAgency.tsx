import axiosClient from '@/axios.client';
import { useEffect, useState } from 'react'
import { Account, AgencyPromo, PayAccount } from './interface/interface';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EditAgencyProfileForm from './sub-component/EditAgencyProfileForm';
import EditAgencyPaymentAccount from './sub-component/EditAgencyPaymentAccount';
import { useLogin } from '@/context/LoginContext';
import EditAgencyPassword from './sub-component/EditAgencyPassword';
import EditAgencyPromoCode from './sub-component/EditAgencyPromoCode';

const EditProfileAgency = ({account_id} : {account_id:number}) => {
    const [ agency, setAgency ] = useState<Account>();
    const [ payment, setPayment ] = useState<PayAccount[]>([]);
    const [ promo , setPromo] = useState<AgencyPromo[]>([]);
    const { t } = useTranslation();
    const { user } = useLogin();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.post('v1/GetAccountInfoById', { account_id : account_id });
                setAgency(response.data.account);
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        const fetchData2 = async () => {
            try {
                const response = await axiosClient.post('v1/GetAllAgencyPaymentByAgencyId', { agency_id : user?.agency_id });
                setPayment(response.data.data);
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        const fetchData3 = async () => {
            try {
                const response = await axiosClient.post('v1/GetAllPromo', { });
                setPromo(response.data.promo);
            } catch (error) {
                console.log(error)
            } 
        }

        fetchData();
        fetchData2();
        fetchData3();
    }, [])

    return (
        <div className='w-[64rem] p-12 '>
            <h1 className="text-2xl mb-8">{t('Edit Profile')}</h1>
            <Tabs defaultValue="agency_data">
                <TabsList>
                    <TabsTrigger value="agency_data">{t('Agency Data')}</TabsTrigger>
                    <TabsTrigger value="account">{t('Payment Account')}</TabsTrigger>
                    <TabsTrigger value="password">{t('Password')}</TabsTrigger>
                    <TabsTrigger value="promo">{t('Promo Code')}</TabsTrigger>
                </TabsList>
                <TabsContent value="agency_data">
                    {agency ? (
                        <EditAgencyProfileForm agency={agency} />
                    ) : (
                        <p>Loading...</p>
                    )}
                </TabsContent>
                <TabsContent value="account"><EditAgencyPaymentAccount payment={payment}/></TabsContent>
                <TabsContent value="password"><EditAgencyPassword/></TabsContent>
                <TabsContent value="promo"><EditAgencyPromoCode promoDataRows={promo}/></TabsContent>
            </Tabs>
        </div>
    )
}

export default EditProfileAgency

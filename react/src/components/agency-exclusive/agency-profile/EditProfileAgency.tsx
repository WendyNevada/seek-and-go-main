import axiosClient from '@/axios.client';
import { useEffect, useState } from 'react'
import { Account, PayAccount } from './interface/interface';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EditAgencyProfileForm from './sub-component/EditAgencyProfileForm';
import EditAgencyPaymentAccount from './sub-component/EditAgencyPaymentAccount';
import { useLogin } from '@/context/LoginContext';
import EditAgencyPassword from './sub-component/EditAgencyPassword';

const EditProfileAgency = ({account_id} : {account_id:number}) => {
    const [ agency, setAgency ] = useState<Account>();
    const [ payment, setPayment ] = useState<PayAccount[]>([]);
    const { t } = useTranslation();
    const { user } = useLogin();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.post('v1/GetAccountInfoById', { account_id : account_id });
                console.log(response.data);
                setAgency(response.data.account);
                console.log('agencies const : ', agency)
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        const fetchData2 = async () => {
            console.log('agency id : ',user?.agency_id)
            try {
                const response = await axiosClient.post('v1/GetAllAgencyPaymentByAgencyId', { agency_id : user?.agency_id });
                console.log(response.data);
                setPayment(response.data.data);
                console.log('payment res : ', response)
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
        fetchData2();
        console.log('agencies const : ', agency)
    }, [])

    return (
        <div className='w-[64rem] p-12 '>
            <h1 className="text-2xl mb-8">{t('Edit Profile')}</h1>
            <Tabs defaultValue="agency_data">
                <TabsList>
                    <TabsTrigger value="agency_data">{t('Agency Data')}</TabsTrigger>
                    <TabsTrigger value="account">{t('Payment Account')}</TabsTrigger>
                    <TabsTrigger value="password">{t('Password')}</TabsTrigger>
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
            </Tabs>
        </div>
    )
}

export default EditProfileAgency

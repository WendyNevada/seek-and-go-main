import { useEffect, useState } from "react";
import { Account } from "./interface/interface";
import { useTranslation } from "react-i18next";
import axiosClient from "@/axios.client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditCustomerProfileForm from "./sub-component/EditCustomerProfileForm";
import EditCustomerPassword from "./sub-component/EditCustomerPassword";

const EditProfileCustomer = ({account_id} : {account_id:number}) => {

    const [ customer, setCustomer ] = useState<Account>();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.post('v1/GetAccountInfoById', { account_id : account_id });
                setCustomer(response.data.account);
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [])

  return (
    <div className='w-[64rem] p-12 '>
            <h1 className="text-2xl mb-8">{t('Edit Profile')}</h1>
            <Tabs defaultValue="agency_data">
                <TabsList>
                    <TabsTrigger value="agency_data">{t('Customer Data')}</TabsTrigger>
                    <TabsTrigger value="password">{t('Password')}</TabsTrigger>
                </TabsList>
                <TabsContent value="agency_data">
                    {customer ? (
                        <EditCustomerProfileForm customer={customer} />
                    ) : (
                        <p>Loading...</p>
                    )}
                </TabsContent>
                <TabsContent value="password"><EditCustomerPassword/></TabsContent>
            </Tabs>
        </div>
  )
}

export default EditProfileCustomer
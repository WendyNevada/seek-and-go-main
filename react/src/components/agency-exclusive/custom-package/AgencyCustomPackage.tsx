import axiosClient from "@/axios.client";
import { useLogin } from "@/context/LoginContext"
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Package } from "./interface/interface";
import HashLoader from "react-spinners/HashLoader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const AgencyCustomPackage = () => {
    const user = useLogin();
    const [ loading, setLoading ] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [ customPackage, setCustomPackage ] = useState<Package[]>([]);
    const [status, setStatus] = useState<string | null>(null);

    useEffect(() => {
      const fetchData = async () => {
          setLoading(true);
          try {
              const response = await axiosClient.post('v1/GetCustomPackageByAgencyId', { agency_id: user.user?.agency_id, custom_status: status});
              if(response.data.status == "error") {
                setCustomPackage([]);
              } else {
                setCustomPackage(response.data.package);
              }
          } catch (error) {
              console.error(error);
              setCustomPackage([]);
          } finally {
              setLoading(false);
          }
      }
      fetchData();
      }, [status])

      const navigatePackageDetail = (package_h_id: number) => {
        navigate('/Agency/CustomPackageDetail/' + package_h_id);
    }

    const handleValueChange = (newValue: string) => {
      if(newValue == "ALL") {
        setStatus(null)
      }
      else {
        setStatus(newValue)
      }
    }

  return (
      <div className='w-[80rem]'>
        <div className='flex flex-col items-left text-left mt-4 mb-4'>
                <p className='text-5xl py-2 my-8'>{t('My Orders')}</p>
                <Select
                    onValueChange={handleValueChange}
                >
                    <SelectTrigger className='w-64'>
                        <SelectValue placeholder={t('All')}/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">{t('All')}</SelectItem>
                        <SelectItem value="NEW">New Request</SelectItem>
                        <SelectItem value="APV">Approved Request</SelectItem>
                        <SelectItem value="RJT">Rejected Request</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          <div className="block rounded-lg bg-blue-100 shadow-secondary-1 dark:bg-surface-dark p-10 shadow-xl">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <HashLoader size={50} color={"#123abc"} loading={loading} />
                    </div>
                ) : (
                    customPackage.length > 0 ? (
                        customPackage.map((customPackage) => (
                            <div className='bg-white rounded-lg p-4 space-y-3 space-x-56 flex flex-row align-center mb-4' key={customPackage.package_h_id}>
                                <div className="flex flex-col">
                                    <div className='text-sm bg-blue-500 w-max p-2 rounded-3xl text-white flex flex-row'>
                                        <p className='font-bold mr-5'>{t('Code')}</p>
                                        <p>{customPackage.package_code}</p>
                                    </div>
                                    <div className="text-sm w-max p-2 rounded-3xlflex flex-row max-w-[10rem]">
                                        <p className='font-bold text-lg truncate'>{customPackage.customer_name}</p>
                                        <p className='font-bold text-lg truncate'>{customPackage.package_name}</p>
                                    </div>
                                </div>

                                <div className="flex flex-row ml-6 space-x-12 items-center">
                                    <div className='text-sm w-max p-2 rounded-3xl flex flex-col max-w-[8rem]'>
                                        <p className='font-bold mr-5'>{t('Total Days')}</p>
                                        <p className='font-bold text-lg text-blue-500 truncate'>{customPackage.total_days}</p>
                                    </div>
                                    <div className="text-sm w-max p-2 rounded-3xl flex flex-col">
                                        <p className='text-sm font-bold'>{t('Status')}</p>
                                        <p className='font-bold text-lg text-blue-500'>{customPackage.custom_status}</p>
                                    </div>
                                </div>
                                <div className="flex flex-row ml-24 items-center">
                                    <Button variant={'primary'} className='w-[10rem]' onClick={() => navigatePackageDetail(parseInt(customPackage.package_h_id))}>Detail</Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>{t('No orders found')}</p>
                    )
                )}
            </div>
      </div>
    )
  }

export default AgencyCustomPackage
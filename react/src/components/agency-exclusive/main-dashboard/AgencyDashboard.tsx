import axiosClient from '@/axios.client';
import DoughnutChart from '@/components/ui/Chart/dougnutChart'
import { useLogin } from '@/context/LoginContext';
import { useEffect, useState } from 'react'
import HashLoader from 'react-spinners/HashLoader';

interface OrderStatus {
    order_status: string;
    total: number;
}

const AgencyDashboard = () => {
    const { user } = useLogin();
    const [chartData, setChartData] = useState<OrderStatus[]>([]); // State to hold fetched data
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axiosClient.post('v1/GetStatsForOrder', { agency_id : user?.agency_id });
                setChartData(response.data);
                setLoading(false);
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    },[user?.agency_id]);

    return (
        <div>
            {loading ? (
                    <div className="flex justify-center items-center">
                        <HashLoader size={50} color={"#123abc"} loading={loading} />
                    </div>
            ) : (
            <div className="x-auto max-w-2xl px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl">
                <DoughnutChart orderData={chartData}/>
            </div>
            )}
        </div>
    )
}

export default AgencyDashboard;

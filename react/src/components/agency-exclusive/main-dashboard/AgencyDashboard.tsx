import axiosClient from '@/axios.client';
import DoughnutChart from '@/components/ui/Chart/dougnutChart'
import { useLogin } from '@/context/LoginContext';
import React, { useEffect, useState } from 'react'

interface OrderStatus {
    order_status: string;
    total: number;
}

const AgencyDashboard = () => {
    const { user } = useLogin();
    const [chartData, setChartData] = useState<OrderStatus[]>([]); // State to hold fetched data

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.post('v1/GetStatsForOrder', { agency_id : user?.agency_id });
                setChartData(response.data);
            }
            catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    },[user?.agency_id]);

    return (
        <div>
            <div className="x-auto max-w-2xl px-6 py-12 bg-white border-0 shadow-lg sm:rounded-3xl">
                <DoughnutChart orderData={chartData}/>
            </div>
        </div>
    )
}

export default AgencyDashboard;

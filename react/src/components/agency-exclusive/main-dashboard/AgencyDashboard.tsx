import axiosClient from '@/axios.client';
import DoughnutChart from '@/components/ui/Chart/dougnutChart'
import React, { useEffect, useState } from 'react'

const AgencyDashboard = () => {

    const [chartData, setChartData] = useState(null); // State to hold fetched data

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axiosClient.post('v1/GetVehicleById', { ref_vehicle_id: ref_vehicle_id });
            setChartData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        };

  return (
    <div>
        <div className="max-w-2xl mx-auto p-6 lg:p-8">
            <DoughnutChart/>
        </div>
    </div>
  )
}

export default AgencyDashboard

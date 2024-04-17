import { useState, useEffect } from "react";
import axiosClient from "@/axios.client";

interface City {
    value: string;
    label: string;
}

interface Area {
    area_2: string;
}

interface UseCityQueryProps {
    selectedProvince: string;
}

export function useCityQuery({ selectedProvince }: UseCityQueryProps) {
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.post("/v1/GetArea2ByArea1", { area_code: selectedProvince });
            if (response.status !== 200) {
                throw new Error("Failed to fetch data");
            }
            const data: Area[] = response.data;
            const cities: City[] = data.map((item) => ({ value: item.area_2, label: item.area_2 }));
            setCities(cities); // Update component state with fetched data
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedProvince]);

    return { cities, loading };
}

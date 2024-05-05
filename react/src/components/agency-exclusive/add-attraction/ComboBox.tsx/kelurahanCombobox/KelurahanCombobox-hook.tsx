import { useState, useEffect } from "react";
import axiosClient from "@/axios.client";

interface Kelurahan {
    value: string;
    label: string;
}

interface Area {
    area_4: string;
}

interface UseKelurahanQueryProps {
    selectedKecamatan: string;
    selectedCity: string;
    selectedProvince: string;
}

export function useKelurahanQuery({ selectedKecamatan, selectedCity, selectedProvince }: UseKelurahanQueryProps) {
    const [kelurahan, setKelurahan] = useState<Kelurahan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.post("/v1/GetArea4ByArea3AndArea2AndArea1", { area_1: selectedProvince, area_2 : selectedCity, area_3 : selectedKecamatan});
            if (response.status !== 200) {
                throw new Error("Failed to fetch data");
            }
            const data: Area[] = response.data;
            const kelurahan: Kelurahan[] = data.map((item) => ({ value: item.area_4, label: item.area_4 }));
            setKelurahan(kelurahan); // Update component state with fetched data
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedKecamatan]);

    return { kelurahan, loading };
}

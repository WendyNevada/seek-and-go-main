import { useState, useEffect } from "react";
import axiosClient from "@/axios.client";

interface Kecamatan {
    value: string;
    label: string;
}

interface Area {
    area_3: string;
}

interface UseKecamatanQueryProps {
    selectedCity: string;
    selectedProvince: string;
}

export function useKecamatanQuery({ selectedCity, selectedProvince }: UseKecamatanQueryProps) {
    const [kecamatan, setKecamatan] = useState<Kecamatan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.post("/v1/GetArea3ByArea2AndArea1", { area_1: selectedProvince, area_2 : selectedCity});
            if (response.status !== 200) {
                throw new Error("Failed to fetch data");
            }
            const data: Area[] = response.data;
            const kecamatan: Kecamatan[] = data.map((item) => ({ value: item.area_3, label: item.area_3 }));
            setKecamatan(kecamatan); // Update component state with fetched data
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedCity]);

    return { kecamatan, loading };
}

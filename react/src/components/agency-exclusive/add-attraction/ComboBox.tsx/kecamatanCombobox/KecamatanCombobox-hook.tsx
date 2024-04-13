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
}

export function useKecamatanQuery({ selectedCity }: UseKecamatanQueryProps) {
    const [kecamatan, setKecamatan] = useState<Kecamatan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.post("/v1/GetArea3ByArea2", { area_code: selectedCity });
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

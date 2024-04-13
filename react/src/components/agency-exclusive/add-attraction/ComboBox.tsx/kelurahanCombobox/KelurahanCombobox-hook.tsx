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
}

export function useKelurahanQuery({ selectedKecamatan }: UseKelurahanQueryProps) {
    const [kelurahan, setKelurahan] = useState<Kelurahan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.post("/v1/GetArea4ByArea3", { area_code: selectedKecamatan });
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

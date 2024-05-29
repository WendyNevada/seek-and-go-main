// apiUtils.ts

import axiosClient from "@/axios.client";
import { toast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hitAddApi = async (apiEndpoint: string, values: any) => {
    try{
        const response = await axiosClient.post(apiEndpoint, values);
        if (response.data.status == "ok") {
            toast({
                variant: "success",
                description: response.data.message
            });
            //return response.data;
            return response.status;
        }
        else if(response.data.message){
            toast({
                variant: "destructive",
                description: response.data.message,
            });
        }
    }catch(response){
        const axiosError = response as AxiosError; // Cast the error to AxiosError
        if (axios.isAxiosError(response)) {
            // Check if the error is an AxiosError
            toast({
                variant: "destructive",
                description: (
                    axiosError.response?.data as { message: string }
                )?.message,
            });
        }
    }

};

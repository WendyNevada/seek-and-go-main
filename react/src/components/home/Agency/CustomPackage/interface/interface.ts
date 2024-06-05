export interface addPackageCustom {
    package_code: string;
    agency_id: number;
    customer_id : number;
    package_name: string;
    description: string;
    total_days: number;
    details: {
        ref_hotel_id?: string | null;
        ref_attraction_id?: string | null;
        ref_vehicle_id?: string | null;
        start_dt?: string | null;
        end_dt?: string | null;
    }[];
}

export interface addPackage {
    package_code: string;
    agency_id: string;
    package_name: string;
    description: string;
    package_price: number;
    qty: number;
    total_days: number;
    details: {
        ref_hotel_id?: string | null;
        ref_attraction_id?: string | null;
        ref_vehicle_id?: string | null;
        start_dt?: string | null;
        end_dt?: string | null;
    }[];
}

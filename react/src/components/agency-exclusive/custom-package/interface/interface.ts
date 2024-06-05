export interface Package {
    package_h_id: string;
    package_code: string;
    agency_id: string;
    customer_id: string;
    is_custom: number;
    custom_status: string;
    package_name: string;
    description: string;
    package_price: number;
    qty: number;
    total_days: number;
    customer_name: string | null;
    customer_phone: string | null;
    customer_email: string | null;
    package_ds: {
        package_h_id: string | null;
        ref_hotel_id?: string | null;
        ref_attraction_id?: string | null;
        ref_vehicle_id?: string | null;
        start_dt?: string | null;
        end_dt?: string | null;
        price?: number | null;
    }[];
}

export interface PackageDs {
    package_h_id: string | null;
    ref_hotel_id?: string | null;
    ref_attraction_id?: string | null;
    ref_vehicle_id?: string | null;
    start_dt?: string | null;
    end_dt?: string | null;
    price?: number | null;
}
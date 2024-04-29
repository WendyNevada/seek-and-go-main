export interface OrderH {
    order_h_id: number;
    agency_id: number;
    customer_id: number;
    order_no: string;
    order_dt: string;
    total_price: number;
    order_status: string;
    created_at: string;
    updated_at: string;
}

export interface OrderD {
    order_h_id: number;
    agency_id: number;
    customer_id: number;
    order_no: string;
    order_dt: string;
    total_price: number;
    order_status: string;
    created_at: string;
    updated_at: string;
    order_ds: {
        order_d_id: number;
        order_h_id: number;
        package_h_id: number;
        package_history_id: number;
        ref_hotel_id: number;
        ref_attraction_id: number | null;
        ref_vehicle_id: number | null;
        start_dt: string;
        end_dt: string;
        price: number | null;
        created_at: string;
        updated_at: string;
    };
}


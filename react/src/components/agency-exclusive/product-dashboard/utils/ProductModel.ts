export type GetAttractionModel = {
    ref_attraction_id: number;
    attraction_code: string;
    ref_zipcode_id: number;
    attraction_name: string;
    description: string;
    address: string;
    rating: number;
    is_active: boolean;
    qty: number;
    promo_code: string;
    created_at: Date;
    updated_at: Date;
    base_price: number;
    image_url: string;
}

export type GetVehicleModel = {
    ref_vehicle_id :number;
    vehicle_code : string;
    ref_zipcode_id : number;
    vehicle_type : string;
    vehicle_brand : string;
    vehicle_series : string;
    vehicle_model : string;
    vehicle_seat : number;
    vehicle_year : number;
    vehicle_name : string;
    description : string;
    with_driver : boolean;
    address : string;
    rating: number;
    is_active: boolean;
    qty: number;
    promo_code: string;
    created_at: Date;
    updated_at: Date;
    base_price: number;
    image_url: string;
}

export type GetHotelModel = {
    ref_hotel_id :number;
    hotel_code : string;
    ref_zipcode_id : number;
    hotel_name : string;
    description : string;
    address : string;
    rating: number;
    is_active: boolean;
    qty: number;
    promo_code: string;
    created_at: Date;
    updated_at: Date;
    base_price: number;
    image_url: string;
}

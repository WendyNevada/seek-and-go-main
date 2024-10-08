export interface GetAttractionModel {
    status: string
    message: string
    data: DaumAttraction[]
  }

  export interface DaumAttraction {
    ref_attraction_id: number
    attraction_code: string
    ref_zipcode_id: number
    attraction_name: string
    description: string
    address: string
    rating: number
    is_active: number
    qty: number
    created_at: string
    updated_at: string
    image_url: string
    base_price: number
    agency_name: string
    address_zipcode: string
  }

export interface GetVehicleModel {
    status: string
    message: string
    data: DaumVehicle[]
  }

  export interface DaumVehicle {
    ref_vehicle_id: number
    vehicle_code: string
    ref_zipcode_id: number
    vehicle_type: string
    vehicle_brand: string
    vehicle_series: string
    vehicle_model: string
    vehicle_seat: number
    vehicle_year: string
    vehicle_name: string
    description: string
    with_driver: number
    address: string
    rating: number
    is_active: number
    qty: number
    created_at: string
    updated_at: string
    image_url: string
    base_price: number
    agency_name: string
    address_zipcode: string
  }

export interface GetHotelModel {
    status: string
    message: string
    data: DaumHotel[]
}

export interface DaumHotel {
    ref_hotel_id: number
    hotel_code: string
    ref_zipcode_id: number
    hotel_name: string
    description: string
    address: string
    rating: number
    is_active: number
    qty: number
    created_at: string
    updated_at: string
    image_url: string
    base_price: number
    agency_name: string
    address_zipcode: string
}

export interface Package {
    package_h_id: number;
    package_code: string;
    agency_id: number;
    customer_id: number | null;
    package_name: string;
    description: string;
    is_custom: number;
    custom_status: string | null;
    package_price: number;
    is_active: number;
    qty: number;
    total_days: number;
    created_at: string;
    updated_at: string;
}

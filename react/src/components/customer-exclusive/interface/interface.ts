// Vehicle
export interface VehicleRoot {
    agency_id: number
    vehicle: Vehicle
    picture_url: string
    base_price: number
    address_zipcode: string
  }

  export interface Vehicle {
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
  }

// Hotel
export interface HotelRoot {
    hotel: Hotel
    picture_url: string
    base_price: number
    agency_id: number
    address_zipcode: string
  }

  export interface Hotel {
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
  }

// Attraction
export interface AttractionRoot {
    status: string
    message: string
    attraction: Attraction
    picture_url: string
    base_price: number
    agency_id: number
    address_zipcode: string
  }

  export interface Attraction {
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
  }

  export interface AgencyData {
    agency_id: number
    account_id: number
    agency_name: string
    npwp: string
    location: string
    created_at: string
    updated_at: string
    agency_payments: AgencyPayment[]
  }

  export interface AgencyPayment {
    agency_payment_id: number
    agency_id: number
    payment_type: string
    bank_name: string
    account_no?: string
    account_name: string
    created_at: string
    updated_at: string
    image_url?: string
  }

  export interface OrderData {
    agency_id : number
    customer_id : number
    order_dt : string
    details : OrderDetail[]
  }

  export interface OrderDetail {
    package_h_id? : number | null
    ref_hotel_id? : number | null
    ref_attraction_id? : number | null
    ref_vehicle_id? : number | null
    start_dt : string
    end_dt : string
    price : number
    qty : number
    product_type: string
  }


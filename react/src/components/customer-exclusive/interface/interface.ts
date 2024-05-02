export interface VehicleRoot {
    vehicle: Vehicle
    picture_url: string
    base_price: number
    address: string
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

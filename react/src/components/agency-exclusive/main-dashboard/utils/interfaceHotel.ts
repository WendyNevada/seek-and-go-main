export interface HotelH {
    hotel: Hotel
    picture_url: string
    base_price: number
    agency_id: number
    address: string
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

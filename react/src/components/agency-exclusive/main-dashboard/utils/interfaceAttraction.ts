export interface AttractionH {
    attraction: Attraction
    picture_url: string
    base_price: number
    agency_id: number
    address: string
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

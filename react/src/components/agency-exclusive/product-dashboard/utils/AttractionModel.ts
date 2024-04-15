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

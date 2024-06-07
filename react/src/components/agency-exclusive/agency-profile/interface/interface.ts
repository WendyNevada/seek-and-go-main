export interface Account {
    account_id: number
    account_name: string
    email: string
    role: string
    phone: string
    email_verified_at: string
    created_at: string
    updated_at: string
    agencies: Agencies
}

export interface Agencies {
    agency_id: number
    account_id: number
    agency_name: string
    npwp: string
    location: string
    created_at: string
    updated_at: string
}

export interface PayAccount {
  agency_payment_id: number
  agency_id: number
  payment_type: string
  bank_name: string
  account_no: string
  account_name: string
  created_at: string
  updated_at: string
  image_url: string
  picture: File
}

export interface ChangePassword {
  old_password: string
  password: string
  confirm_password: string
}

export interface AgencyPromo {
  promo_code : string
  start_date : string
  end_date : string
  is_hotel : number
  is_vehicle : number
  is_attraction : number
  is_amount : number
  amount : number
  percent : number
  max_use : number
}

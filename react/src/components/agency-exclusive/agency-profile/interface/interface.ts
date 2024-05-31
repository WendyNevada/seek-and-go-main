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
  created_at: string
  updated_at: string
  image_url: string
}

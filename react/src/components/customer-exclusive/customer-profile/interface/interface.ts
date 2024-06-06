export interface Account {
    account_id: number
    account_name: string
    email: string
    role: string
    phone: string
    email_verified_at: string
    created_at: string
    updated_at: string
    customers: Customers
}

export interface Customers {
    customer_id: number
    account_id: number
    customer_name: string
    gender: string
    birth_date: string
    created_at: string
    updated_at: string
}

export interface ChangePassword {
  old_password: string
  password: string
  confirm_password: string
}

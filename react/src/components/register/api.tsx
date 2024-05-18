export interface CustomerRegisterItems {
    customer_name: string;
    account_name: string;
    email: string;
    phone: string;
    birth_date: Date;
    gender: string;
    password: string;
    //confirmPassword: string;
    role: string;
}

export interface AgencyRegisterItems {
    name: string;
    email: string;
    npwp: string;
    location: string;
    password: string;
    confirmPassword: string;
}

export interface AgencyRegisterDisplay{
    agencyRegisterDisplay: AgencyRegisterItems[],
}



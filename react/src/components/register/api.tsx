export interface CustomerRegisterItems {
    name: string;
    email: string;
    phone: string;
    dob: Date;
    gender: string;
    password: string;
    confirmPassword: string;
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
    agencyRegisterDisplay: AgencyRegisterItems,
}


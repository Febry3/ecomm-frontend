export interface User {
    user_id: number;
    username: string;
    email: string;
    profile_url?: string;
    role: string;
}

export interface GoogleLoginResponse {
    access_token: string;
    email: string;
    first_name: string;
    last_name?: string;
    id: number;
    phone_number?: string;
    username?: string;
    profile_url?: string;
    role: string;
}

export interface Address {
    address_id: string
    user_id: number
    address_label: string
    receiver_name: string
    street_address: string
    rt?: string
    rw?: string
    village: string
    district: string
    city: string
    province: string
    postal_code: string
    notes?: string
    is_default: boolean
    created_at?: string
    updated_at?: string
}
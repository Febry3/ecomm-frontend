import apiClient from "@/lib/api-client";
import { ChangeGroupBuySessionStatusRequest } from "@/types/group-buy";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Request types (snake_case for API)
export interface GroupBuyTierRequest {
    participant_threshold: number;
    discount_percentage: number;
}

export interface CreateGroupBuyRequest {
    product_variant_id: string;
    min_participants: number;
    max_participants: number;
    max_quantity: number;
    expires_at: string;
    tiers: GroupBuyTierRequest[];
    title?: string;
}


export async function createBuyerGroupBuySession(data: { productVariantId: string, title: string }) {
    const response = await apiClient.post<{ data: { session_code: string } }>("/group-buy", {
        product_variant_id: data.productVariantId,
        title: data.title
    });
    return response.data.data.session_code;
}


// Response types (matching actual API response)
export interface GroupBuyTierResponse {
    id: string;
    group_buy_session_id: string;
    participant_threshold: number;
    discount_percentage: number;
}

export interface ProductImageResponse {
    id: string;
    product_id: string;
    image_url: string;
    created_at: string;
}

export interface ProductResponse {
    id: string;
    title: string;
    product_images?: ProductImageResponse[];
}

export interface ProductVariantStockResponse {
    product_variant_id: string;
    current_stock: number;
    reserved_stock: number;
    low_stock_threshold: number;
    last_updated: string;
}

export interface ProductVariantResponse {
    id: string;
    product_id: string;
    sku: string;
    name: string;
    price: number;
    is_active: boolean;
    stock?: ProductVariantStockResponse;
    product?: ProductResponse;
}

export interface SellerResponse {
    id: number;
    user_id: number;
    store_name: string;
    store_slug: string;
    description: string;
    logo_url: string;
    business_email: string;
    business_phone: string;
    status: string;
    is_verified: boolean;
    average_rating: number;
    total_sales: number;
    created_at: string;
    updated_at: string;
}

export interface GroupBuySession {
    id: string;
    title?: string;
    session_code: string;
    product_variant_id: string;
    seller_id: number;
    min_participants: number;
    max_participants: number;
    current_participants?: number;
    max_quantity?: number;
    status: "active" | "completed" | "cancelled" | "expired";
    expires_at: string;
    created_at: string;
    updated_at: string;
    product_variant: ProductVariantResponse;
    seller: SellerResponse;
    group_buy_tiers: GroupBuyTierResponse[];
}

export function useGetGroupBuySessions() {
    return useQuery({
        queryKey: ["seller-group-buy-sessions"],
        queryFn: async () => {
            const response = await apiClient.get("/seller/group-buy");
            return response.data.data as GroupBuySession[];
        },
    });
}

export function useCreateGroupBuySession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateGroupBuyRequest) => {
            const response = await apiClient.post("/seller/group-buy", data);
            return response.data.data;
        },
        onSuccess: () => {
            toast.success("Group Buy Session Created", {
                description: "Your group buy campaign is now active.",
            });
            queryClient.invalidateQueries({ queryKey: ["seller-group-buy-sessions"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to create group buy session");
        },
    });
}

export function useChangeGroupBuySessionStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: ChangeGroupBuySessionStatusRequest) => {
            const response = await apiClient.patch("/seller/group-buy/status", data);
            return response.data.data;
        },
        onSuccess: () => {
            toast.success("Session Cancelled", {
                description: "The group buy session has been cancelled.",
            })
            queryClient.invalidateQueries({ queryKey: ["seller-group-buy-sessions"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to change group buy session status");
        },
    });
}



export interface GroupBuySessionDetailsResponse {
    buyer_group_session: {
        id: string;
        group_buy_session_id: string;
        session_code: string;
        organizer_user_id: number;
        product_variant_id: string;
        title: string;
        current_participants: number;
        status: string;
        expires_at: string;
        created_at: string;
        updated_at: string;
        members: {
            id: string;
            session_id: string;
            user_id: number;
            order_id: string | null;
            quantity: number;
            status: string;
            joined_at: string;
            user: {
                id: number;
                username: string;
                email: string;
                profile_url: string;
            };
        }[];
    };
    address: {
        address_id: string;
        user_id: number;
        address_label: string;
        receiver_name: string;
        street_address: string;
        village: string;
        district: string;
        city: string;
        province: string;
        postal_code: string;
        notes: string;
        is_default: boolean;
        created_at: string;
        updated_at: string;
    }[];
    product_variant: {
        id: string;
        product_id: string;
        sku: string;
        name: string;
        price: number;
        is_active: boolean;
        stock: {
            product_variant_id: string;
            current_stock: number;
            reserved_stock: number;
            low_stock_threshold: number;
            version: number;
            last_updated: string;
        };
        product: {
            id: string;
            title: string;
            description: string;
            product_images: {
                id: string;
                product_id: string;
                image_url: string;
                alt_text: string;
                created_at: string;
            }[];
        };
    };
    product_session: {
        id: string;
        product_variant_id: string;
        seller_id: number;
        min_participants: number;
        max_participants: number;
        status: string;
        expires_at: string;
        group_buy_tiers: GroupBuyTierResponse[] | null;
    };
}

export async function getGroupBuySession(sessionCode: string, token?: string) {
    const response = await apiClient.get<{ data: GroupBuySessionDetailsResponse }>(`/group-buy/${sessionCode}`);
    return response.data.data;
}

export function useGetGroupBuySession(sessionCode: string) {
    return useQuery({
        queryKey: ["group-buy-session", sessionCode],
        queryFn: () => getGroupBuySession(sessionCode),
        enabled: !!sessionCode,
    });
}

export async function getSessionIdByCode(code: string): Promise<string | null> {
    try {
        const response = await apiClient.get<{ data: GroupBuySessionDetailsResponse }>(`/group-buy/${code}`);
        return response.data.data ? response.data.data.buyer_group_session.session_code : null;
    } catch {
        return null;
    }
}

export function useJoinGroupBuySession() {
    return useMutation({
        mutationFn: async (sessionCode: string) => {
            await apiClient.post(`/group-buy/${sessionCode}/join`);
        },
        onSuccess: () => {
            toast.success("Successfully joined the group buy session!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to join session");
        },
    });
}



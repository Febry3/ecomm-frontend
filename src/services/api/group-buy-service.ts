import apiClient from "@/lib/api-client";
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
    session_code: string;
    product_variant_id: string;
    seller_id: number;
    min_participants: number;
    max_participants: number;
    current_participants?: number;
    max_quantity: number;
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
            toast.error(error.response?.data?.message || "Failed to create group buy session");
        },
    });
}

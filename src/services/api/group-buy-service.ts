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


export async function getGroupBuySession(id: string, token?: string) {
    // Mock Data Implementation
    return new Promise<GroupBuySession>((resolve) => {
        setTimeout(() => {
            resolve({
                id: "1",
                session_code: "g7JekL0d",
                product_variant_id: "variant-1",
                seller_id: 1,
                min_participants: 1,
                max_participants: 10,
                current_participants: 5,
                max_quantity: 100,
                status: "active",
                expires_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                product_variant: {
                    id: "variant-1",
                    product_id: "product-1",
                    sku: "KEY-FAN-MAX",
                    name: "Keyboard Gaming Fantech MAXFIT",
                    price: 427350,
                    is_active: true,
                    product: {
                        id: "product-1",
                        title: "Keyboard Gaming Fantech MAXFIT",
                        product_images: [
                            {
                                id: "img-1",
                                product_id: "product-1",
                                image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
                                created_at: new Date().toISOString()
                            }
                        ]
                    }
                },
                seller: {
                    id: 1,
                    user_id: 1,
                    store_name: "Fantech Official",
                    store_slug: "fantech-official",
                    description: "Official Fantech Store",
                    logo_url: "",
                    business_email: "support@fantech.id",
                    business_phone: "08123456789",
                    status: "active",
                    is_verified: true,
                    average_rating: 4.8,
                    total_sales: 1000,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                },
                group_buy_tiers: [
                    {
                        id: "tier-1",
                        group_buy_session_id: "1",
                        participant_threshold: 5,
                        discount_percentage: 10
                    }
                ]
            } as GroupBuySession);
        }, 100);
    });
}


export async function getSessionIdByCode(code: string): Promise<string | null> {
    // Mock Data Implementation
    return new Promise((resolve) => {
        setTimeout(() => {
            if (code === "g7JekL0d") {
                resolve("1");
            } else {
                resolve(null);
            }
        }, 1000);
    });
}



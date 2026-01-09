
import apiClient from "@/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface CreateOrderPayload {
    product_variant_id: string;
    quantity: number;
    address_id: string;
    bank_code: string;
}

export interface CreateGroupBuyOrderPayload {
    buyer_group_session_id: string;
    address_id: string;
    bank_code: string;
    cashback?: number;
    product_group_buy_tier_id?: string;
}

export interface Order {
    id: string;
    order_number: string;
    status: string;
    quantity: number;
    price_at_order: number;
    subtotal: number;
    delivery_charge: number;
    total_amount: number;
    payment: {
        id: string;
        bank_code: string;
        va_number: string;
        amount: number;
        status: string;
        expired_at: string;
        paid_at?: string;
    };
    product: {
        product_id: string;
        product_name: string;
        variant_id: string;
        variant_name: string;
        image_url: string;
    };
    seller: {
        id: number;
        shop_name: string;
    };
    created_at: string;
}

export type CreateOrderResponse = Order; // Alias for backward compatibility if needed

export function useCreateOrder() {
    return useMutation<Order, Error, CreateOrderPayload>({
        mutationFn: async (payload) => {
            const response = await apiClient.post("/user/orders", payload);
            return response.data.data;
        },
        onSuccess: (data) => {
            console.log("Order created:", data);
            toast.success("Order created successfully!");
        },
        onError: (error: any) => {
            console.error(error);
            toast.error("Failed to create order.", {
                description: error.response?.data?.message || "Please try again.",
            });
        },
    });
}

export function useCreateGroupBuyOrder() {
    return useMutation<Order, Error, CreateGroupBuyOrderPayload>({
        mutationFn: async (payload) => {
            const response = await apiClient.post("/user/orders/group-buy", payload);
            return response.data.data;
        },
        onSuccess: (data) => {
            console.log("Group buy order created:", data);
            toast.success("Order created successfully!");
        },
        onError: (error: any) => {
            console.error(error);
            toast.error("Failed to create group buy order.", {
                description: error.response?.data?.message || "Please try again.",
            });
        },
    });
}

export function useGetOrder(orderId: string) {
    return useQuery<Order, Error>({
        queryKey: ["order", orderId],
        queryFn: async () => {
            const response = await apiClient.get(`/user/orders/${orderId}`);
            return response.data.data;
        },
        enabled: !!orderId,
        refetchInterval: 5000, // Poll every 5 seconds
    });
}

export function useGetOrders() {
    return useQuery<Order[], Error>({
        queryKey: ["orders"],
        queryFn: async () => {
            const response = await apiClient.get("/user/orders");
            const data = response.data.data;

            // Handle new structure { orders: [...], ... }
            if (data && Array.isArray(data.orders)) return data.orders;

            // Handle legacy structures
            if (Array.isArray(data)) return data;
            if (data && Array.isArray(data.items)) return data.items;

            return [];
        },
    });
}


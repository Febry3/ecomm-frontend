
import apiClient from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface CreateOrderPayload {
    product_variant_id: string;
    quantity: number;
    address_id: string;
    bank_code: string;
}

export interface CreateOrderResponse {
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
    };
    product: {
        product_id: string;
        product_name: string;
        variant_id: string;
        variant_name: string;
        image_url: string;
    };
    created_at: string;
}

export function useCreateOrder() {
    const queryClient = useQueryClient();

    return useMutation<CreateOrderResponse, Error, CreateOrderPayload>({
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

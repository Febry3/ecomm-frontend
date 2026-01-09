import apiClient from "@/lib/api-client";
import { Wallet } from "@/types/wallet";
import { useQuery } from "@tanstack/react-query";

export function useGetWallet() {
    return useQuery<Wallet>({
        queryKey: ["wallet"],
        queryFn: async () => {
            const response = await apiClient.get("/wallet");
            return response.data.data;
        },
    });
}

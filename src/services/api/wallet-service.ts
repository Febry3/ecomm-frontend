import apiClient from "@/lib/api-client";
import { Wallet } from "@/types/wallet";
import { useQuery } from "@tanstack/react-query";

// Mock Data
const MOCK_WALLET: Wallet = {
    balance: 150000,
    transactions: [
        {
            id: "txn_1",
            amount: 50000,
            type: "credit",
            description: "Cashback from Group Buy #GB-20230101",
            reference_id: "ORD-12345",
            created_at: "2023-01-01T10:00:00Z",
        },
        {
            id: "txn_2",
            amount: 100000,
            type: "credit",
            description: "Cashback from Group Buy #GB-20230105",
            reference_id: "ORD-67890",
            created_at: "2023-01-05T14:30:00Z",
        }
    ]
};

export function useGetWallet() {
    return useQuery<Wallet>({
        queryKey: ["wallet"],
        queryFn: async () => {
            // Simulate API call
            // const response = await apiClient.get("/user/wallet");
            // return response.data.data;

            // Return mock for now
            return new Promise((resolve) => {
                setTimeout(() => resolve(MOCK_WALLET), 500);
            });
        },
    });
}

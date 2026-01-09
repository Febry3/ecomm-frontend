export interface WalletTransaction {
    id: string;
    amount: number;
    type: "credit" | "debit";
    description: string; // e.g., "Cashback from Order #ORD-123"
    reference_id?: string; // e.g., Order ID or Group Buy ID
    created_at: string;
}

export interface Wallet {
    balance: number;
    transactions: WalletTransaction[];
}

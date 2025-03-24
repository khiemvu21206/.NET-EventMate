export interface TransactionHistory {
    transactionId: string;
    type: string;
    method: string;
    walletId: string;
    createdAt: string; 
    amount: number;
    status: string;
}
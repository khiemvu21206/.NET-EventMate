/* eslint-disable @typescript-eslint/no-explicit-any */
import createRepository from '@/ultilities/createRepository';

interface BankInfo {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

interface DepositData {
  amount: number;
  method: string;
}

interface WithdrawData {
  amount: number;
  method: string;
  bankInfo: BankInfo;
}

export const WalletRepository = createRepository({
  getWalletInfo: async (fetch, token?: string) => {
    if (!token) {
      throw new Error('Unauthorized');
    }

    console.log('Making API call with token:', token.substring(0, 20) + '...');
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Wallet/wallet-info`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status >= 400) {
      console.error('API Error:', response.status);
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response;
  },

  deposit: async (fetch, data: DepositData, token?: string) => {
    if (!token) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Wallet/deposit`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data,
    });
    
    if (response.status >= 400) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response;
  },

  withdraw: async (fetch, data: WithdrawData, token?: string) => {
    if (!token) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Wallet/withdraw`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data,
    });
    
    if (response.status >= 400) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response;
  },

  getListTransaction: async (fetch, data: any, token?: string) => {
    if (!token) {
      throw new Error('Unauthorized');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/Wallet/transactions_list`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data,
    });
    
    if (response.status >= 400) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response;
  },
});
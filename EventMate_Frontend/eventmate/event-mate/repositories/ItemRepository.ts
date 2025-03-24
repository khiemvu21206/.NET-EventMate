import createRepository from '@/ultilities/createRepository';
import { useRouter } from 'next/navigation';

interface PurchaseRequest {
    buyerId: string;
    itemId: string;
    quantity: number;
}

interface PurchaseResponse {
    orderId: string;
}

export const ItemRepository = createRepository({
    // Lấy danh sách tất cả items
    getAllItems: async (fetch) => {
        try {
            const response = await fetch('https://localhost:7121/api/items', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            // Log để debug
            console.log('Raw API Response:', response);
            
            return response;
        } catch (error) {
            console.error('API Error:', error);
            throw new Error('Lỗi khi gọi API: ' + error);
        }
    },

    // Lấy chi tiết một item theo ID
    getItemById: async (fetch, itemId: string) => {
        try {
            const response = await fetch(`https://localhost:7121/api/Item/${itemId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            // Log để debug
            console.log('Raw Item Response:', response);
            
            if (!response.data) {
                throw new Error('Failed to fetch item details');
            }

            return response;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    purchaseItem: async (fetch, data: PurchaseRequest, token: string): Promise<PurchaseResponse> => {
        console.log('Sending purchase request:', data);

        const response = await fetch('https://localhost:7121/api/Item/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: data
        });

        console.log('Purchase response:', response); // Debug log

        if (response.error || response.status !== 200) {
            throw new Error('Purchase failed');
        }

        return response.data;
    },
});

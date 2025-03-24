import createRepository from '@/ultilities/createRepository';

export enum OrderStatus {
    WaitingForApproval = 0,
    Accepted = 1,
    InTransit = 2,
    Rejected = 3,
    Delivered = 4,
    Completed = 5
}

export interface OrderDTO {
    orderId: string;
    totalPrice: number;
    createdAt: string;
    address: string | null;
    phoneNumber: string | null;
    status: OrderStatus;
    userId: string;
    userName: string;
    itemId: string;
    itemName: string;
    itemPrice: number;
}

interface UpdateOrderStatusRequest {
    orderId: string;
    newStatus: OrderStatus;
}

export const orderRepository = createRepository({
    // Lấy danh sách order của user
    getUserOrders: async (fetch, userId: string, page: number = 1, pageSize: number = 10) => {
        const response = await fetch(`https://localhost:7121/api/Order/user/${userId}?CurrentPage=${page}&PageSize=${pageSize}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.error || response.status !== 200) {
            throw new Error('Failed to fetch user orders');
        }

        return response.data;
    },

    // Lấy danh sách order của seller
    getSellerOrders: async (fetch, sellerId: string, page: number = 1, pageSize: number = 10) => {
        console.log('Fetching seller orders with params:', { sellerId, page, pageSize });
        const response = await fetch(`https://localhost:7121/api/Order/seller/${sellerId}?CurrentPage=${page}&PageSize=${pageSize}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Raw API Response:', response);

        if (response.error || response.status !== 200) {
            console.error('Error fetching seller orders:', response.error || response.status);
            throw new Error('Failed to fetch seller orders');
        }

        // Return the data property directly since it contains the paginated data
        return response.data.data;
    },

    // Lấy chi tiết một order
    getOrderById: async (fetch, orderId: string) => {
        const response = await fetch(`https://localhost:7121/api/Order/${orderId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.error || response.status !== 200) {
            throw new Error('Failed to fetch order details');
        }

        return response;
    },

    // Cập nhật trạng thái order
    updateOrderStatus: async (fetch, data: UpdateOrderStatusRequest, token: string) => {
        const response = await fetch('https://localhost:7121/api/Order/status', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: data
        });

        if (response.error || response.status !== 200) {
            throw new Error(response.data?.message || 'Failed to update order status');
        }

        return response.data;
    }
});

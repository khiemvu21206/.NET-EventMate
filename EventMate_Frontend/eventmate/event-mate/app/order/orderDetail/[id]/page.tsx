'use client';

import React, { useState, useEffect } from 'react';
import { FiPrinter, FiEdit2, FiAlertCircle } from 'react-icons/fi';
import { orderRepository } from '@/repositories/OrderRepository';
import { useParams } from 'next/navigation';

enum OrderStatus {
    WaitingForApproval = 0,
    Accepted = 1,
    InTransit = 2,
    Rejected = 3,
    Delivered = 4,
    Completed = 5
}

interface OrderResponse {
    orderId: string;
    userId: string;
    userName: string;
    status: OrderStatus;
    createdAt: string;
    timeEnd?: string;
    phoneNumber?: string;
    address?: string;
    itemId: string;
    itemName: string;
    itemPrice: number;
    totalPrice: number;
}

const OrderDetailPage = () => {
    const params = useParams();
    const orderId = params.id as string;
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [order, setOrder] = useState<OrderResponse | null>(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                console.log('Params:', params);
                console.log('OrderId:', orderId);
                setIsLoading(true);
                const response = await orderRepository.getOrderById(orderId);
                console.log('Component received response:', response);
                console.log('Order data:', response.data);
                setOrder({
                    ...response.data,
                    status: Number(response.data.status) as OrderStatus
                });
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching order:', err);
                setError('Failed to fetch order details');
                setIsLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    const statusColors = {
        [OrderStatus.WaitingForApproval]: "bg-yellow-100 text-yellow-800",
        [OrderStatus.Accepted]: "bg-blue-100 text-blue-800",
        [OrderStatus.InTransit]: "bg-purple-100 text-purple-800",
        [OrderStatus.Rejected]: "bg-red-100 text-red-800",
        [OrderStatus.Delivered]: "bg-green-100 text-green-800",
        [OrderStatus.Completed]: "bg-gray-100 text-gray-800"
    };

    const getStatusColor = (status: OrderStatus) => {
        return statusColors[status] || "bg-gray-100 text-gray-800";
    };

    const getDotColor = (status: OrderStatus) => {
        const colors = {
            [OrderStatus.WaitingForApproval]: "bg-yellow-500",
            [OrderStatus.Accepted]: "bg-blue-500",
            [OrderStatus.InTransit]: "bg-purple-500",
            [OrderStatus.Rejected]: "bg-red-500",
            [OrderStatus.Delivered]: "bg-green-500",
            [OrderStatus.Completed]: "bg-gray-500"
        };
        return colors[status] || "bg-gray-500";
    };

    const handlePrint = () => {
        window.print();
    };

    const handleReportTransaction = () => {
        // TODO: Implement report logic
    };

    if (isLoading) {
        return <div className="min-h-screen bg-gray-100 p-8">Loading...</div>;
    }

    if (error || !order) {
        return <div className="min-h-screen bg-gray-100 p-8 text-red-600">{error || 'Order not found'}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Order Details</h1>
                            <div className="inline-flex items-center px-3 py-1 mt-2 bg-gray-50 border border-gray-200 rounded-full">
                                <span className="text-gray-700 font-medium text-sm">{order.orderId}</span>
                            </div>
                        </div>
                        <div className="flex gap-3">                           
                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <FiPrinter className="w-5 h-5" />
                                <span>Print Order</span>
                            </button>
                            <button
                                onClick={handleReportTransaction}
                                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                <FiAlertCircle className="w-5 h-5" />
                                <span>Report Transaction</span>
                            </button>
                        </div>
                    </div>

                    {/* Order Status and Dates */}
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getDotColor(order.status)}`}></div>
                            <span className="text-gray-700">
                                Status:
                                <span className={`ml-2 px-2 py-1 rounded-full ${getStatusColor(order.status)} font-medium capitalize`}>
                                    {OrderStatus[order.status]}
                                </span>
                            </span>
                        </div>
                        <div className="flex gap-8">
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Order Date</p>
                                <p className="text-gray-900 font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            {order.timeEnd && (
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Delivery Date</p>
                                    <p className="text-gray-900 font-medium">{new Date(order.timeEnd).toLocaleDateString()}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Information Grid */}
                <div className="grid grid-cols-3 gap-6 mb-6">
                    {/* Customer Information */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 pb-4 mb-4 border-b border-gray-200">Customer Information</h2>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                            <div>
                                <p className="font-medium text-gray-900">{order.userName || 'Unknown User'}</p>
                            </div>
                        </div>
                        <div className="space-y-3 bg-gray-50 border border-gray-200 p-4 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="text-gray-900">{order.phoneNumber || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Information */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 pb-4 mb-4 border-b border-gray-200">Shipping Information</h2>
                        <div className="space-y-3 bg-gray-50 border border-gray-200 p-4 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-500">Address</p>
                                <p className="text-gray-900">{order.address || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 pb-4 mb-4 border-b border-gray-200">Payment Information</h2>
                        <div className="space-y-3 bg-gray-50 border border-gray-200 p-4 rounded-lg">
                            <div className="pt-2">
                                <p className="text-sm text-gray-500">Payment Status</p>
                                <div className="inline-flex items-center px-2 py-1 mt-1 bg-green-50 rounded-full">
                                    <span className="text-green-600 font-medium capitalize">Paid</span>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-gray-200">
                                <p className="text-sm text-gray-500">Transaction ID</p>
                                <div className="inline-flex items-center px-2 py-0.5 mt-1 bg-gray-50 border border-gray-200 rounded-full">
                                    <span className="text-gray-600 text-sm">{order.orderId}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200">
                    <div className="p-6 border-b border-gray-200 bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Product</th>
                                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Price</th>
                                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200"></div>
                                            <div>
                                                <p className="font-medium text-gray-900">{order.itemName}</p>
                                                <div className="inline-flex items-center px-2 py-0.5 mt-1 bg-gray-50 border border-gray-200 rounded-full">
                                                    <span className="text-gray-600 text-xs">ID: {order.itemId}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-900">${order.itemPrice}</td>
                                    <td className="px-6 py-4 text-right font-medium text-gray-900">${order.totalPrice}</td>
                                </tr>
                            </tbody>
                            <tfoot className="bg-gray-50 border-t border-gray-200">
                                <tr className="border-t-2 border-gray-200">
                                    <td colSpan={2} className="px-6 py-4 text-right text-base font-medium text-gray-900">Total</td>
                                    <td className="px-6 py-4 text-right text-base font-bold text-gray-900">${order.totalPrice}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;

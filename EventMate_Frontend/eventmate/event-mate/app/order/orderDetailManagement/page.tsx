'use client';

import StatusUpdateModal from '@/components/order/StatusUpdateModal';
import React, { useState, useEffect } from 'react';
import { FiPrinter, FiEdit2, FiAlertCircle } from 'react-icons/fi';

interface OrderItem {
    id: string;
    name: string;
    sku: string;
    price: number;
    quantity: number;
    total: number;
}

interface Order {
    id: string;
    status: string;
    orderDate: string;
    deliveryDate: string;
    customer: {
        id: string;
        name: string;
        email: string;
        phone: string;
    };
    shippingInfo: {
        address: string;
        city: string;
        state: string;
        country: string;
        method: string;
    };
    payment: {
        cardLast4: string;
        status: string;
        transactionId: string;
    };
    items: OrderItem[];
    subtotal: number;
    shippingCost: number;
    tax: number;
    total: number;
}

const OrderDetailPage = () => {
    const [order, setOrder] = useState<Order>({
        id: "#ORD-2025-1234",
        status: "delivered",
        orderDate: "Jan 15, 2025",
        deliveryDate: "Jan 18, 2025",
        customer: {
            id: "#CUS-1234",
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "+1 (555) 123-4567"
        },
        shippingInfo: {
            address: "123 Main Street, Apt 4B",
            city: "New York",
            state: "NY",
            country: "United States",
            method: "Express Delivery"
        },
        payment: {
            cardLast4: "4567",
            status: "paid",
            transactionId: "#TXN-5678-9012"
        },
        items: [
            {
                id: "1",
                name: "Product Name 1",
                sku: "PRD-001",
                price: 99.99,
                quantity: 2,
                total: 199.98
            },
            {
                id: "2",
                name: "Product Name 2",
                sku: "PRD-002",
                price: 149.99,
                quantity: 1,
                total: 149.99
            }
        ],
        subtotal: 349.97,
        shippingCost: 9.99,
        tax: 35.00,
        total: 394.96
    });

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(order.status);

    const statusColors = {
        processing: "bg-blue-100 text-blue-800",
        shipped: "bg-purple-100 text-purple-800",
        delivered: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
        pending: "bg-yellow-100 text-yellow-800"
    };

    const statusOptions = {
        processing: {
            label: "Processing",
            color: "bg-blue-100 text-blue-800",
            description: "Order is being processed"
        },
        shipped: {
            label: "Shipped",
            color: "bg-purple-100 text-purple-800",
            description: "Order has been shipped"
        },
        delivered: {
            label: "Delivered",
            color: "bg-green-100 text-green-800",
            description: "Order has been delivered"
        },
        cancelled: {
            label: "Cancelled",
            color: "bg-red-100 text-red-800",
            description: "Order has been cancelled"
        },
        pending: {
            label: "Pending",
            color: "bg-yellow-100 text-yellow-800",
            description: "Order is pending"
        }
    };

    const getStatusColor = (status: string) => {
        const lowerStatus = status.toLowerCase().trim();
        return statusColors[lowerStatus as keyof typeof statusColors] || "bg-gray-100 text-gray-800";
    };

    const getDotColor = (status: string) => {
        const colors = {
            processing: "bg-blue-500",
            shipped: "bg-purple-500",
            delivered: "bg-green-500",
            cancelled: "bg-red-500",
            pending: "bg-yellow-500"
        };
        return colors[status.toLowerCase().trim() as keyof typeof colors] || "bg-gray-500";
    };

    const handlePrint = () => {
        window.print();
    };

    const handleStatusUpdate = () => {
        setOrder(prev => ({
            ...prev,
            status: selectedStatus
        }));
        setShowUpdateModal(false);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Order Details</h1>
                            <div className="inline-flex items-center px-3 py-1 mt-2 bg-gray-50 border border-gray-200 rounded-full">
                                <span className="text-gray-700 font-medium text-sm">{order.id}</span>
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
                                onClick={() => setShowUpdateModal(true)}
                                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                <FiEdit2 className="w-5 h-5" />
                                <span>Change Status</span>
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
                                    {order.status}
                                </span>
                            </span>
                        </div>
                        <div className="flex gap-8">
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Order Date</p>
                                <p className="text-gray-900 font-medium">{order.orderDate}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Delivery Date</p>
                                <p className="text-gray-900 font-medium">{order.deliveryDate}</p>
                            </div>
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
                                <p className="font-medium text-gray-900">{order.customer.name}</p>
                                <div className="inline-flex items-center px-2 py-0.5 mt-1 bg-gray-50 border border-gray-200 rounded-full">
                                    <span className="text-gray-600 text-xs">{order.customer.id}</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3 bg-gray-50 border border-gray-200 p-4 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="text-gray-900">{order.customer.email}</p>
                            </div>
                            <div className="pt-2 border-t border-gray-200">
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="text-gray-900">{order.customer.phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Information */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 pb-4 mb-4 border-b border-gray-200">Shipping Information</h2>
                        <div className="space-y-3 bg-gray-50 border border-gray-200 p-4 rounded-lg">
                            <div>
                                <p className="text-sm text-gray-500">Address</p>
                                <p className="text-gray-900">{order.shippingInfo.address}</p>
                                <p className="text-gray-900">{order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.country}</p>
                            </div>
                            <div className="pt-2 border-t border-gray-200">
                                <p className="text-sm text-gray-500">Shipping Method</p>
                                <p className="text-gray-900">{order.shippingInfo.method}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 pb-4 mb-4 border-b border-gray-200">Payment Information</h2>
                        <div className="space-y-3 bg-gray-50 border border-gray-200 p-4 rounded-lg">
                            <div className="flex items-center gap-2 bg-white p-2 rounded border border-gray-200">
                                <div className="w-10 h-6 bg-blue-600 rounded"></div>
                                <p className="text-gray-900">**** {order.payment.cardLast4}</p>
                            </div>
                            <div className="pt-2 border-t border-gray-200">
                                <p className="text-sm text-gray-500">Payment Status</p>
                                <div className="inline-flex items-center px-2 py-1 mt-1 bg-green-50 rounded-full">
                                    <span className="text-green-600 font-medium capitalize">{order.payment.status}</span>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-gray-200">
                                <p className="text-sm text-gray-500">Transaction ID</p>
                                <div className="inline-flex items-center px-2 py-0.5 mt-1 bg-gray-50 border border-gray-200 rounded-full">
                                    <span className="text-gray-600 text-sm">{order.payment.transactionId}</span>
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
                                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Quantity</th>
                                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {order.items.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-100 rounded border border-gray-200"></div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{item.name}</p>
                                                    <div className="inline-flex items-center px-2 py-0.5 mt-1 bg-gray-50 border border-gray-200 rounded-full">
                                                        <span className="text-gray-600 text-xs">SKU: {item.sku}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-900">{formatCurrency(item.price)}</td>
                                        <td className="px-6 py-4 text-right text-gray-900">{item.quantity}</td>
                                        <td className="px-6 py-4 text-right font-medium text-gray-900">{formatCurrency(item.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50 border-t border-gray-200">
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-500">Subtotal</td>
                                    <td className="px-6 py-4 text-right font-medium text-gray-900">{formatCurrency(order.subtotal)}</td>
                                </tr>
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-500">Shipping</td>
                                    <td className="px-6 py-4 text-right font-medium text-gray-900">{formatCurrency(order.shippingCost)}</td>
                                </tr>
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-right text-sm font-medium text-gray-500">Tax</td>
                                    <td className="px-6 py-4 text-right font-medium text-gray-900">{formatCurrency(order.tax)}</td>
                                </tr>
                                <tr className="border-t-2 border-gray-200">
                                    <td colSpan={3} className="px-6 py-4 text-right text-base font-medium text-gray-900">Total</td>
                                    <td className="px-6 py-4 text-right text-base font-bold text-gray-900">{formatCurrency(order.total)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            <StatusUpdateModal
                isOpen={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                onUpdate={handleStatusUpdate}
                currentStatus={order.status}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                statusColors={statusColors}
                statusOptions={statusOptions}
            />
        </div>
    );
};

export default OrderDetailPage;

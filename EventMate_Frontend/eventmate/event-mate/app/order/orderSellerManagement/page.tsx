'use client';

import React, { useState, useEffect } from 'react';
import { FiFilter, FiDownload, FiEdit2 } from 'react-icons/fi';
import FilterModal from '@/components/order/FilterOrderModal';
import UpdateStatusModal from '@/components/order/UpdateStatusModal';
import { orderRepository, OrderDTO } from '@/repositories/OrderRepository';
import { useUserContext } from '@/providers/UserProvider';

enum OrderStatus {
    WaitingForApproval = 0,
    Accepted = 1,
    InTransit = 2,
    Rejected = 3,
    Delivered = 4,
    Completed = 5
}

const getStatusColor = (status: OrderStatus) => {
    switch(status) {
        case OrderStatus.WaitingForApproval:
            return 'bg-yellow-100 text-yellow-800';
        case OrderStatus.Accepted:
            return 'bg-blue-100 text-blue-800';
        case OrderStatus.InTransit:
            return 'bg-purple-100 text-purple-800';
        case OrderStatus.Rejected:
            return 'bg-red-100 text-red-800';
        case OrderStatus.Delivered:
            return 'bg-green-100 text-green-800';
        case OrderStatus.Completed:
            return 'bg-gray-100 text-gray-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const OrderManagementPage = () => {
    const { id: sellerId } = useUserContext();
    
    // Modal states
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [filterDate, setFilterDate] = useState({ start: '', end: '' });
    const [filterPrice, setFilterPrice] = useState({ min: '', max: '' });

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(5);
    const [itemsPerPage] = useState(10);

    // Data states
    const [orders, setOrders] = useState<OrderDTO[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<OrderDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch orders
    const fetchOrders = async () => {
        if (!sellerId) return;
        
        try {
            setIsLoading(true);
            const response = await orderRepository.getSellerOrders(sellerId, currentPage, itemsPerPage);
            console.log("API Response:", response); // Debug log

            if (!response || !Array.isArray(response)) {
                console.error("Invalid response format:", response);
                throw new Error('Invalid response format');
            }

            console.log("Orders Data:", response); // Debug log
            console.log("Total Count:", response.length); // Debug log

            setOrders(response);
            setFilteredOrders(response);
            setTotalPages(Math.ceil(response.length / itemsPerPage));
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [sellerId, currentPage]);

    // Effect for filtering orders
    useEffect(() => {
        let result = orders ? [...orders] : [];

        // Apply search filter
        if (searchQuery) {
            result = result.filter(order => 
                order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.itemName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter !== 'All Status') {
            result = result.filter(order => OrderStatus[Number(order.status)] === statusFilter);
        }

        // Apply date filter
        if (filterDate.start && filterDate.end) {
            const startDate = new Date(filterDate.start);
            const endDate = new Date(filterDate.end);
            result = result.filter(order => {
                const orderDate = new Date(order.createdAt);
                return orderDate >= startDate && orderDate <= endDate;
            });
        }

        setFilteredOrders(result);
    }, [searchQuery, statusFilter, filterDate, orders]);

    // Handlers
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value);
    };

    const handleFilterApply = () => {
        setShowFilterModal(false);
    };

    const handleStatusUpdate = async (newStatus: OrderStatus) => {
        if (!selectedOrder) return;

        try {
            const response = await orderRepository.updateOrderStatus({
                orderId: selectedOrder,
                newStatus: newStatus
            }, localStorage.getItem('token') || '');
            
            setShowStatusModal(false);
            
            // Show success message
            if (newStatus === OrderStatus.Accepted) {
                alert('Order has been accepted and payment processed successfully');
            } else {
                alert('Order status updated successfully');
            }
            
            fetchOrders(); // Refresh orders after update
        } catch (error: any) {
            console.error('Failed to update order status:', error);
            
            // Handle specific error cases
            if (error.response?.data?.key === 'PaymentFailed') {
                alert('Payment failed: ' + error.response.data.data);
            } else if (error.response?.data?.key === 'QuantityNotEnough') {
                alert('Cannot process order: ' + error.response.data.data);
            } else {
                alert('Failed to update order status: ' + (error.message || 'Unknown error'));
            }
        }
    };

    const handleExport = () => {
        const headers = ['Order ID', 'Customer', 'Product', 'Date', 'Status', 'Total'];
        const csvContent = [
            headers.join(','),
            ...filteredOrders.map(order => [
                order.orderId,
                order.userName,
                order.itemName,
                new Date(order.createdAt).toLocaleDateString(),
                OrderStatus[Number(order.status)],
                order.totalPrice
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'orders.csv';
        link.click();
    };

    if (isLoading) {
        return <div className="min-h-screen bg-gray-100 p-8">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Order Management</h1>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                            />
                        </div>
                        <select 
                            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                            value={statusFilter}
                            onChange={handleStatusFilterChange}
                        >
                            <option>All Status</option>
                            {Object.keys(OrderStatus)
                                .filter(key => isNaN(Number(key)))
                                .map(status => (
                                    <option key={status}>{status}</option>
                                ))
                            }
                        </select>
                        <button
                            onClick={() => setShowFilterModal(true)}
                            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 flex items-center gap-2"
                        >
                            <FiFilter className="w-5 h-5" />
                            Filter
                        </button>
                        <button 
                            onClick={handleExport}
                            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 flex items-center gap-2"
                        >
                            <FiDownload className="w-5 h-5" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Order ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Customer</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Product</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Total</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredOrders && filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => (
                                        <tr key={order.orderId} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <span className="text-gray-900 font-medium">{order.orderId}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="text-gray-900">{order.userName}</p>
                                                    <p className="text-gray-500 text-sm">{order.phoneNumber}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-900">{order.itemName}</td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(Number(order.status))}`}>
                                                    {OrderStatus[Number(order.status)]}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-900">${order.totalPrice}</td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(order.orderId);
                                                        setShowStatusModal(true);
                                                    }}
                                                    className="text-gray-700 hover:text-gray-900 font-medium flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors duration-200 ease-in-out hover:bg-gray-100"
                                                >
                                                    <FiEdit2 className="w-4 h-4" />
                                                    Update Status
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                            No orders found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} entries
                            </p>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-4 py-2 rounded-lg text-sm ${
                                            currentPage === page
                                                ? 'bg-gray-900 text-white'
                                                : 'border border-gray-200 text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button 
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <FilterModal
                showFilterModal={showFilterModal}
                onClose={() => setShowFilterModal(false)}
                onApply={handleFilterApply}
                filterDate={filterDate}
                filterPrice={filterPrice}
                setFilterDate={setFilterDate}
                setFilterPrice={setFilterPrice}
            />

            <UpdateStatusModal
                showModal={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                onUpdate={handleStatusUpdate}
                orderId={selectedOrder}
                currentStatus={Number(filteredOrders.find(order => order.orderId === selectedOrder)?.status ?? OrderStatus.WaitingForApproval)}
            />
        </div>
    );
};

export default OrderManagementPage;

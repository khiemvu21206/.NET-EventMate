"use client";
import React from 'react';
import { useState, useEffect } from "react";
import { FiShoppingBag, FiEye, FiClock, FiCheck, FiX, FiFilter, FiCalendar, FiDollarSign } from "react-icons/fi";
import FilterModal from '@/components/order/FilterOrderModal';
import Link from 'next/link';
import { orderRepository, OrderDTO } from '@/repositories/OrderRepository';
import { useUserContext } from '@/providers/UserProvider';

interface OrderListState {
    orders: OrderDTO[];
    totalCount: number;
    currentPage: number;
    isLoading: boolean;
    error: string | null;
}

// Thêm enum OrderStatus
enum OrderStatus {
    WaitingForApproval = 0,
    Accepted = 1,
    InTransit = 2,
    Rejected = 3,
    Delivered = 4,
    Completed = 5
}

// Hàm chuyển đổi số sang text
const getStatusText = (status: number): string => {
    return OrderStatus[status] || 'Unknown';
};

const OrderList = () => {
    const { id: userId } = useUserContext();
    const [state, setState] = useState<OrderListState>({
        orders: [],
        totalCount: 0,
        currentPage: 1,
        isLoading: true,
        error: null
    });
    const [activeTab, setActiveTab] = useState("allorders");
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filterDate, setFilterDate] = useState({ start: "", end: "" });
    const [filterPrice, setFilterPrice] = useState({ min: "", max: "" });
    const ordersPerPage = 10;

    const fetchOrders = async (page: number) => {
        if (!userId) return;
        
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const response = await orderRepository.getUserOrders(userId, page, ordersPerPage);
            console.log("API Response:", response); // Debug log

            if (!response || !response.data) {
                throw new Error('Invalid response format');
            }

            setState(prev => ({
                ...prev,
                orders: response.data,
                totalCount: response.totalCount,
                currentPage: page,
                isLoading: false
            }));
            console.log("Updated State:", state); // Debug log
        } catch (error) {
            console.error("Error fetching orders:", error); // Debug log
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: 'Failed to fetch orders'
            }));
        }
    };

    useEffect(() => {
        fetchOrders(1);
    }, [userId]);

    const handlePageChange = (page: number) => {
        fetchOrders(page);
    };

    const statusColors = {
        WaitingForApproval: "bg-yellow-100 text-yellow-800",
        Accepted: "bg-blue-100 text-blue-800",
        InTransit: "bg-purple-100 text-purple-800",
        Rejected: "bg-red-100 text-red-800",
        Delivered: "bg-green-100 text-green-800",
        Completed: "bg-gray-100 text-gray-800"
    };

    const getStatusColor = (status: string | OrderStatus) => {
        return statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800";
    };

    const filteredOrders = (state.orders || []).filter(order => {
        const orderStatus = Number(order.status);
        const matchesTab = activeTab === "allorders" || 
            (activeTab === "waitingforapproval" && orderStatus === OrderStatus.WaitingForApproval) ||
            (activeTab === "accepted" && orderStatus === OrderStatus.Accepted) ||
            (activeTab === "intransit" && orderStatus === OrderStatus.InTransit) ||
            (activeTab === "rejected" && orderStatus === OrderStatus.Rejected) ||
            (activeTab === "delivered" && orderStatus === OrderStatus.Delivered) ||
            (activeTab === "completed" && orderStatus === OrderStatus.Completed);
            
        const matchesSearch = searchQuery === "" || 
            order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.itemName.toLowerCase().includes(searchQuery.toLowerCase());

        // Filter theo date
        const orderDate = new Date(order.createdAt);
        const matchesDate = (!filterDate.start || orderDate >= new Date(filterDate.start)) &&
            (!filterDate.end || orderDate <= new Date(filterDate.end));

        // Filter theo price
        const matchesPrice = (!filterPrice.min || order.totalPrice >= Number(filterPrice.min)) &&
            (!filterPrice.max || order.totalPrice <= Number(filterPrice.max));

        return matchesTab && matchesSearch && matchesDate && matchesPrice;
    });

    if (state.isLoading) {
        return <div className="p-8">Loading...</div>;
    }

    if (state.error) {
        return <div className="p-8 text-red-600">{state.error}</div>;
    }

    return (
        <div className="p-8 max-w-7xl mx-auto bg-white min-h-screen">
            <div className="mb-10">
                <h1 className="text-3xl font-semibold text-gray-900 mb-6">My Orders</h1>
                <div className="flex gap-8 border-b border-gray-200">
                    {["All Orders", "Waiting For Approval", "Accepted", "In Transit", "Rejected", "Delivered", "Completed"].map((tab) => (
                        <button
                            key={tab}
                            className={`pb-4 px-2 text-sm font-medium ${
                                activeTab === tab.toLowerCase().replace(/\s+/g, '')
                                    ? "border-b-2 border-gray-900 text-gray-900"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                            onClick={() => setActiveTab(tab.toLowerCase().replace(/\s+/g, ''))}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-4 gap-6 mb-10">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{state.totalCount}</p>
                        </div>
                        <div className="p-3 bg-white rounded-full shadow-md border-2 border-gray-900">
                            <FiShoppingBag className="w-6 h-6 text-gray-900" />
                        </div>
                    </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Waiting For Approval</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{(state.orders || []).filter(o => Number(o.status) === OrderStatus.WaitingForApproval).length}</p>
                        </div>
                        <div className="p-3 bg-white rounded-full shadow-md border-2 border-gray-900">
                            <FiClock className="w-6 h-6 text-gray-900" />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Completed</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{(state.orders || []).filter(o => Number(o.status) === OrderStatus.Completed).length}</p>
                        </div>
                        <div className="p-3 bg-white rounded-full shadow-md border-2 border-gray-900">
                            <FiCheck className="w-6 h-6 text-gray-900" />
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Rejected</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{(state.orders || []).filter(o => Number(o.status) === OrderStatus.Rejected).length}</p>
                        </div>
                        <div className="p-3 bg-white rounded-full shadow-md border-2 border-gray-900">
                            <FiX className="w-6 h-6 text-gray-900" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 flex justify-between items-center border-b border-gray-200">
                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <svg
                            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    <button 
                        className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ml-4 flex items-center gap-2"
                        onClick={() => setShowFilterModal(true)}
                    >
                        <FiFilter className="w-4 h-4" />
                        Filter
                    </button>
                </div>

                <FilterModal 
                    showFilterModal={showFilterModal}
                    onClose={() => setShowFilterModal(false)}
                    onApply={() => {
                        setShowFilterModal(false);
                        fetchOrders(1);
                    }}
                    filterDate={filterDate}
                    filterPrice={filterPrice}
                    setFilterDate={setFilterDate}
                    setFilterPrice={setFilterPrice}
                />

                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="text-left p-4 text-sm font-medium text-gray-600">Order ID</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-600">Product</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-600">Date</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-600">Total</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-600">Status</th>
                            <th className="text-left p-4 text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => (
                            <tr key={order.orderId} className="border-t border-gray-100 hover:bg-gray-50">
                                <td className="p-4">
                                    <span className="text-sm font-medium text-gray-900">{order.orderId}</span>
                                </td>
                                <td className="p-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{order.itemName}</p>
                                        <p className="text-sm text-gray-500">${order.itemPrice}</p>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="text-sm text-gray-600">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className="text-sm font-medium text-gray-900">
                                        ${order.totalPrice}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(OrderStatus[order.status])}`}>
                                        {OrderStatus[order.status]}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <Link 
                                        href={`/order/orderDetail/${order.orderId}`}
                                        className="text-gray-700 hover:text-gray-900 font-medium flex items-center gap-2"
                                    >
                                        <FiEye className="w-5 h-5" />
                                        View Details
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="p-6 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Showing {((state.currentPage - 1) * ordersPerPage) + 1} to{" "}
                        {Math.min(state.currentPage * ordersPerPage, state.totalCount)} of{" "}
                        {state.totalCount} results
                    </p>
                    <div className="flex gap-2">
                        <button 
                            className={`px-4 py-2 border border-gray-200 rounded text-sm ${
                                state.currentPage === 1 
                                ? "text-gray-400 cursor-not-allowed" 
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                            onClick={() => handlePageChange(state.currentPage - 1)}
                            disabled={state.currentPage === 1}
                        >
                            Previous
                        </button>
                        
                        <button 
                            className={`px-4 py-2 border border-gray-200 rounded text-sm ${
                                state.currentPage === Math.ceil(state.totalCount / ordersPerPage)
                                ? "text-gray-400 cursor-not-allowed" 
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                            onClick={() => handlePageChange(state.currentPage + 1)}
                            disabled={state.currentPage === Math.ceil(state.totalCount / ordersPerPage)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderList;
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaCheckCircle, FaCreditCard } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { orderRepository } from '@/repositories/OrderRepository';
import { useSession } from 'next-auth/react';
import { toastHelper } from '@/ultilities/toastMessageHelper';
import { OrderStatus } from '@/repositories/OrderRepository';

interface OrderItem {
    id: string;
    name: string;
    size: string;
    quantity: number;
    price: number;
    image: string;
}

interface OrderDetails {
    orderId: string;
    userId: string;
    items: OrderItem[];
    status: OrderStatus;
    totalAmount: number;
    deliveryFee: number;
    shippingAddress: {
        fullName: string;
        addressLine1: string;
        addressLine2: string;
        city: string;
        postalCode: string;
        country: string;
        phone: string;
    };
    paymentMethod: {
        type: string;
        lastFourDigits: string;
    };
    createdAt: string;
}

const getStatusText = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.WaitingForApproval:
            return 'Waiting for Approval';
        case OrderStatus.Accepted:
            return 'Accepted';
        case OrderStatus.InTransit:
            return 'In Transit';
        case OrderStatus.Rejected:
            return 'Rejected';
        case OrderStatus.Delivered:
            return 'Delivered';
        case OrderStatus.Completed:
            return 'Completed';
        default:
            return 'Unknown';
    }
};

const getStatusColor = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.WaitingForApproval:
            return 'text-yellow-600';
        case OrderStatus.Accepted:
            return 'text-blue-600';
        case OrderStatus.InTransit:
            return 'text-purple-600';
        case OrderStatus.Rejected:
            return 'text-red-600';
        case OrderStatus.Delivered:
            return 'text-green-600';
        case OrderStatus.Completed:
            return 'text-green-700';
        default:
            return 'text-gray-600';
    }
};

export default function CheckoutPage({ params }: { params: { orderId: string } }) {
    const router = useRouter();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                if (!session?.user) {
                    toastHelper.error("Please login to view order details");
                    router.push('/login');
                    return;
                }

                const response = await orderRepository.getOrderById(params.orderId);
                console.log('Order details response:', response);
                
                if (response && response.status === 200 && response.data) {
                    setOrderDetails({
                        orderId: response.data.orderId,
                        userId: response.data.userId,
                        items: [{
                            id: response.data.itemId,
                            name: response.data.itemName,
                            size: '',
                            quantity: 1,
                            price: response.data.itemPrice,
                            image: '/images/product-1.jpg'
                        }],
                        status: response.data.status as OrderStatus,
                        totalAmount: response.data.totalPrice,
                        deliveryFee: 0,
                        shippingAddress: {
                            fullName: response.data.userName,
                            addressLine1: response.data.address || '',
                            addressLine2: '',
                            city: '',
                            postalCode: '',
                            country: '',
                            phone: response.data.phoneNumber || ''
                        },
                        paymentMethod: {
                            type: 'em-wallet',
                            lastFourDigits: '0000'
                        },
                        createdAt: response.data.createdAt
                    });
                }
            } catch (error) {
                console.error('Error fetching order details:', error);
                toastHelper.error("Failed to load order details");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [params.orderId, session]);

    const handleContinueShopping = () => {
        router.push('/');
    };

    const handleContactSupport = () => {
        router.push('/contact');
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">
            <div className="text-xl font-semibold">Loading order details...</div>
        </div>;
    }

    if (!orderDetails) {
        return <div className="min-h-screen flex items-center justify-center">
            <div className="text-xl font-semibold">Order not found</div>
        </div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-6xl mx-auto p-8">
                <div className="flex items-center mb-10 bg-white p-6 rounded-xl border border-gray-200">
                    <FaCheckCircle className="text-3xl text-gray-800 mr-4" />
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Thank you, {orderDetails.shippingAddress.fullName}!</h1>
                        <p className="text-sm text-gray-600">Order #{orderDetails.orderId}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column - Map and Order Details */}
                    <div className="space-y-8">
                        {/* Map */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 h-72 relative">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0966108041488!2d105.7829!3d21.0209!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDAxJzE1LjMiTiAxMDXCsDQ2JzU4LjQiRQ!5e0!3m2!1sen!2s!4v1635825247425!5m2!1sen!2s"
                                className="w-full h-full rounded-lg"
                                loading="lazy"
                            ></iframe>
                        </div>

                        {/* Order Details */}
                        <div className="bg-white rounded-xl border border-gray-200 p-8">
                            <h2 className="text-xl font-semibold mb-6">Order Details</h2>
                            
                            <div className="space-y-6">
                                <div className="pb-4 border-b border-gray-100">
                                    <h3 className="font-medium text-gray-800 mb-2">Contact Information</h3>
                                    <p className="text-gray-600">{orderDetails.shippingAddress.phone || 'Not provided'}</p>
                                </div>

                                <div className="pb-4 border-b border-gray-100">
                                    <h3 className="font-medium text-gray-800 mb-2">Payment Method</h3>
                                    <div className="flex items-center mt-1">
                                        <FaCreditCard className="text-gray-600 mr-2" />
                                        <span className="text-gray-600">EM-Wallet</span>
                                    </div>
                                </div>

                                <div className="pb-4 border-b border-gray-100">
                                    <h3 className="font-medium text-gray-800 mb-2">Delivery Location</h3>
                                    <div className="text-gray-600 space-y-1">
                                        <p>{orderDetails.shippingAddress.fullName}</p>
                                        <p>{orderDetails.shippingAddress.addressLine1 || 'Address not provided'}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium text-gray-800 mb-2">Order Status</h3>
                                    <p className={`font-medium ${getStatusColor(orderDetails.status)}`}>
                                        {getStatusText(orderDetails.status)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="bg-white rounded-xl border border-gray-200 p-8">
                        {/* Order Items */}
                        {orderDetails.items.map((item) => (
                            <div key={item.id} className="flex items-center pb-6 mb-6 border-b border-gray-100">
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-800 text-lg mb-1">{item.name}</h3>
                                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-lg">{item.price.toLocaleString()} VND</p>
                                </div>
                            </div>
                        ))}

                        {/* Order Summary */}
                        <div className="space-y-4">
                            <div className="flex justify-between py-3 border-b border-gray-100">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">{orderDetails.totalAmount.toLocaleString()} VND</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-gray-100">
                                <span className="text-gray-600">Delivery fee</span>
                                <span className="font-medium">{orderDetails.deliveryFee.toLocaleString()} VND</span>
                            </div>
                            <div className="flex justify-between pt-4 items-center">
                                <span className="text-lg font-semibold">Grand total</span>
                                <span className="text-xl font-bold">{(orderDetails.totalAmount + orderDetails.deliveryFee).toLocaleString()} VND</span>
                            </div>
                            <button
                                onClick={handleContinueShopping}
                                className="w-full mt-6 bg-gray-900 text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-colors font-medium text-lg"
                            >
                                Continue shopping
                            </button>
                        </div>
                    </div>
                </div>

                {/* Contact Button */}
                <div className="mt-10 flex justify-center items-center bg-white p-6 rounded-xl border border-gray-200">
                    <button 
                        onClick={handleContactSupport}
                        className="bg-gray-900 text-white px-8 py-4 rounded-xl hover:bg-gray-800 transition-colors font-medium text-lg"
                    >
                        Need help? Contact us
                    </button>
                </div>
            </div>
        </div>
    );
}

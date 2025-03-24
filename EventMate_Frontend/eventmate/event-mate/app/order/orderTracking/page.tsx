'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaSearch, FaTruck, FaMapMarkerAlt, FaRegClock } from 'react-icons/fa';

interface OrderItem {
    id: string;
    name: string;
    size: string;
    price: number;
    quantity: number;
    image: string;
    specs: string[];
}

interface OrderDetails {
    orderNumber: string;
    status: string;
    orderDate: string;
    items: OrderItem[];
    shippingInfo: {
        courier: string;
        trackingNumber: string;
        address: {
            name: string;
            line1: string;
            city: string;
            country: string;
        };
    };
}

export default function OrderTrackingPage() {
    const [orderNumber, setOrderNumber] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [showResults, setShowResults] = useState(true);

    const [orderDetails] = useState<OrderDetails>({
        orderNumber: 'KRL1279',
        status: 'In transit',
        orderDate: '14/02/2025, 08:02',
        items: [
            {
                id: '1',
                name: '501® ORIGINAL GIN',
                size: 'Waist (inch): 28, Pants length (inch): 30',
                price: 1000,
                quantity: 1,
                image: 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg',
                specs: ['Waist (inch): 28', 'Pants length (inch): 30']
            },
            {
                id: '2',
                name: '501® ORIGINAL GIN',
                size: 'Waist (inch): 28, Pants length (inch): 32',
                price: 1000,
                quantity: 1,
                image: 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg',
                specs: ['Waist (inch): 28', 'Pants length (inch): 32']
            }
        ],
        shippingInfo: {
            courier: 'Lotte Global Logistic',
            trackingNumber: '348235045202',
            address: {
                name: 'Duyen test 12',
                line1: '205 Gijanghaean-ro, Gijang-eup, Gijang-gun, Busan, South Korea, 46083',
                city: 'Gijang-gun, Busan',
                country: 'South Korea'
            }
        }
    });

    const handleSearch = () => {
        setShowResults(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="text-2xl font-semibold text-center text-gray-900 mb-8">ORDER/DELIVERY INQUIRY</h1>

                {/* Search Form */}
                <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                            <input
                                type="text"
                                placeholder="Order Number"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-gray-900 focus:ring-0"
                            />
                        </div>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 pointer-events-none">
                                and
                            </span>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-gray-900 focus:ring-0"
                            />
                        </div>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 pointer-events-none">
                                or
                            </span>
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-gray-900 focus:ring-0"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleSearch}
                        className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                        Check
                    </button>
                </div>

                {showResults && (
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                                <div>
                                    <div className="text-sm text-gray-500">Order Number</div>
                                    <div className="font-medium text-gray-900">{orderDetails.orderNumber}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Status</div>
                                    <div className="font-medium text-gray-900">{orderDetails.status}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Order Date</div>
                                    <div className="font-medium text-gray-900">{orderDetails.orderDate}</div>
                                </div>
                            </div>

                            {/* Products */}
                            <div className="space-y-6">
                                {orderDetails.items.map((item) => (
                                    <div key={item.id} className="flex items-start border-t-2 border-gray-100 pt-6">
                                        <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 ml-4">
                                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                                            <div className="mt-1 space-y-1">
                                                {item.specs.map((spec, index) => (
                                                    <p key={index} className="text-sm text-gray-500">{spec}</p>
                                                ))}
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                                <span>Quantity: {item.quantity}</span>
                                                <span className="mx-2">•</span>
                                                <span>₩{item.price.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 text-sm text-gray-900 border-2 border-gray-900 rounded-lg hover:bg-gray-900 hover:text-white transition-colors">
                                            delivery tracking
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Information */}
                        <div className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-6">SHIPPING ADDRESS</h2>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <FaMapMarkerAlt className="text-gray-400 mt-1" />
                                    <div className="ml-3">
                                        <div className="font-medium text-gray-900">{orderDetails.shippingInfo.address.name}</div>
                                        <div className="text-gray-500 mt-1">{orderDetails.shippingInfo.address.line1}</div>
                                        <div className="text-gray-500">{orderDetails.shippingInfo.address.city}</div>
                                        <div className="text-gray-500">{orderDetails.shippingInfo.address.country}</div>
                                    </div>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <FaTruck className="mr-2" />
                                    <span>Courier: {orderDetails.shippingInfo.courier}</span>
                                    <span className="mx-2">•</span>
                                    <span>Tracking Number: {orderDetails.shippingInfo.trackingNumber}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ItemRepository } from '@/repositories/ItemRepository';
import { WalletRepository } from '@/repositories/WalletRepository';
import { userRepository } from '@/repositories/UserRepository';
import { toastHelper } from '@/ultilities/toastMessageHelper';
import Image from 'next/image';
import { FaCreditCard, FaStore, FaTruck, FaMapMarkerAlt } from 'react-icons/fa';

interface CartItem {
    id: string;
    name: string;
    size: string;
    price: number;
    quantity: number;
    image: string;
}

export default function PaymentPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { data: session } = useSession();
    
    const [itemDetails, setItemDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [walletInfo, setWalletInfo] = useState<any>(null);
    const [userAddress, setUserAddress] = useState<string>('');
    const [newAddress, setNewAddress] = useState<string>('');
    const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
    const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);
    const [cartItem] = useState<CartItem>({
        id: '1',
        name: '511™ Slim Fit Warm Jeans',
        size: '36/34',
        price: 20000,
        quantity: 1,
        image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg'
    });
    
    const itemId = searchParams.get('itemId');
    const quantity = parseInt(searchParams.get('quantity') || '1');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Kiểm tra đăng nhập
                if (!session?.user) {
                    toastHelper.error("Vui lòng đăng nhập để tiếp tục!");
                    router.push('/login');
                    return;
                }

                // Fetch item details
                if (!itemId) {
                    throw new Error('Item ID is required');
                }
                const itemResponse = await ItemRepository.getItemById(itemId);
                console.log('Item Response:', itemResponse); // Debug log
                if (itemResponse.status === 200) {
                    console.log('Item Data:', itemResponse.data); // Debug log
                    setItemDetails(itemResponse.data);
                } else {
                    console.error('Failed to fetch item:', itemResponse);
                    throw new Error('Failed to fetch item details');
                }

                // Fetch wallet info
                const walletResponse = await WalletRepository.getWalletInfo(session.user.token);
                if (walletResponse.status === 200) {
                    setWalletInfo(walletResponse.data);
                }

                // Fetch user info including address
                if (!session?.user?.id) {
                    throw new Error('User ID is required');
                }
                const userResponse = await userRepository.getUserInfo(session.user.token, session.user.id);
                if (userResponse.status === 200) {
                    setUserAddress(userResponse.data.address);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toastHelper.error("Có lỗi xảy ra khi tải thông tin!");
            } finally {
                setLoading(false);
            }
        };

        if (itemId) {
            fetchData();
        }
    }, [itemId, session]);

    const handlePayment = async () => {
        try {
            if (!session?.user || !itemDetails) return;

            // Kiểm tra số dư
            const totalAmount = itemDetails.price * quantity;
            if (walletInfo.balance < totalAmount) {
                toastHelper.error("Số dư không đủ để thực hiện giao dịch!");
                return;
            }

            if (!session?.user?.id) {
                throw new Error('User ID is required');
            }

            if (!session?.user?.token) {
                throw new Error('Token is required');
            }

            // Thực hiện mua hàng
            const purchaseResponse = await ItemRepository.purchaseItem({
                buyerId: session.user.id,
                itemId: itemDetails.itemId,
                quantity: quantity
            }, session.user.token);

            console.log('Purchase response:', purchaseResponse);

            // Chuyển hướng ngay lập tức khi có orderId
            if (purchaseResponse && purchaseResponse.orderId) {
                router.push(`/order/checkout/${purchaseResponse.orderId}`);
            } else {
                throw new Error('Missing orderId in response');
            }
        } catch (error) {
            console.error('Payment error:', error);
            toastHelper.error("Có lỗi xảy ra trong quá trình thanh toán!");
        }
    };

    if (loading) return <div>Đang tải...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Form */}
                    <div className="space-y-6">
                        {/* Account Section */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Account</h2>
                            <div className="space-y-4">
                                <input
                                    type="email"
                                    value={session?.user?.email || ''}
                                    readOnly
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-700"
                                />
                            </div>
                        </div>

                        {/* Delivery Method */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Delivery Method</h2>
                            <div className="space-y-3">
                                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-900 transition-colors">
                                    <input
                                        type="radio"
                                        name="delivery"
                                        checked={deliveryMethod === 'delivery'}
                                        onChange={() => setDeliveryMethod('delivery')}
                                        className="h-4 w-4 text-gray-900"
                                    />
                                    <FaTruck className="ml-3 text-gray-600" />
                                    <span className="ml-3 text-gray-700">Delivery to the entered address</span>
                                </label>

                                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-900 transition-colors">
                                    <input
                                        type="radio"
                                        name="delivery"
                                        checked={deliveryMethod === 'pickup'}
                                        onChange={() => setDeliveryMethod('pickup')}
                                        className="h-4 w-4 text-gray-900"
                                    />
                                    <FaStore className="ml-3 text-gray-600" />
                                    <span className="ml-3 text-gray-700">In-store pickup</span>
                                </label>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h2>
                            {userAddress ? (
                                <div className="flex items-center mb-4 p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                                    <FaMapMarkerAlt className="text-gray-600" />
                                    <span className="ml-3 text-gray-700 text-sm">
                                        {userAddress}
                                    </span>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center mb-4 p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
                                        <FaMapMarkerAlt className="text-gray-600" />
                                        <input
                                            type="text"
                                            placeholder="Enter your shipping address"
                                            value={newAddress}
                                            onChange={(e) => setNewAddress(e.target.value)}
                                            className="ml-3 w-full bg-transparent border-none focus:ring-0 text-gray-700 text-sm"
                                        />
                                    </div>
                                    <button
                                        onClick={async () => {
                                            try {
                                                if (!newAddress.trim()) {
                                                    toastHelper.error("Please enter a valid address");
                                                    return;
                                                }
                                                if (!session?.user?.id) {
                                                    toastHelper.error("User ID not found");
                                                    return;
                                                }
                                                const response = await userRepository.updateAddress(
                                                    session.user.token,
                                                    session.user.id,
                                                    newAddress
                                                );
                                                if (response.status === 200) {
                                                    setUserAddress(newAddress);
                                                    toastHelper.success("Address updated successfully");
                                                }
                                            } catch (error) {
                                                console.error('Error updating address:', error);
                                                toastHelper.error("Failed to update address");
                                            }
                                        }}
                                        className="w-full py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                                    >
                                        Save Address
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-medium text-gray-900">Payment Method</h2>
                            </div>
                            <p className="text-sm text-gray-500 mb-6">All transactions are secure and encrypted.</p>
                            
                            <div className="space-y-6">
                                <div className="flex items-center p-4 border-2 border-gray-900 rounded-lg bg-gray-50">
                                    <FaCreditCard className="text-gray-900" />
                                    <div className="ml-3 flex-1">
                                        <span className="text-gray-900 font-medium">Pay with EM-Wallet</span>
                                        <p className="text-sm text-gray-600 mt-1">Balance: {walletInfo?.balance?.toLocaleString('vi-VN')}đ</p>
                                    </div>
                                </div>

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={useShippingAsBilling}
                                        onChange={(e) => setUseShippingAsBilling(e.target.checked)}
                                        className="h-5 w-5 text-gray-900 rounded border-2 border-gray-300 focus:ring-0"
                                    />
                                    <span className="ml-2 text-gray-700">Use shipping address as billing address</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:sticky lg:top-8 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-gray-200">
                            {/* Product */}
                            <div className="flex items-center pb-6 mb-6 border-b-2 border-gray-200">
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 text-sm mb-0.5">{itemDetails?.name || ''}</h3>
                                    <p className="text-xs text-gray-500">{itemDetails?.size || ''}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-lg">{itemDetails?.price?.toLocaleString('vi-VN')}đ</p>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="space-y-3 border-t-2 border-gray-200 pt-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{(itemDetails?.price * quantity)?.toLocaleString('vi-VN')}đ</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t-2 border-gray-200">
                                    <span className="font-medium text-gray-900">Grand total</span>
                                    <div className="text-right">
                                        <span className="text-xl font-bold text-gray-900">{(itemDetails?.price * quantity)?.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handlePayment}
                                className="mt-6 w-full py-4 bg-black text-white text-lg font-medium rounded-xl hover:bg-gray-900 transition-colors border-2 border-black hover:border-gray-900"
                            >
                                Make a payment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

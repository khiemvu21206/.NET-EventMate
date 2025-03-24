"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toastHelper } from "@/ultilities/toastMessageHelper";
import { Session } from "next-auth";
import { ItemRepository } from '@/repositories/ItemRepository';
import Image from 'next/image';
import {  FaComment } from 'react-icons/fa';

interface CustomSession extends Session {
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    token?: string;
  }
}

interface ItemDetail {
  itemId: string;
  name: string;
  userId: string;
  price: number;
  description: string;
  timeStart: string;
  timeEnd: string;
  quantity: number;
  status: number;
}

interface ApiResponse {
  status: number;
  key: string;
  data: ItemDetail;
  timestamp: number;
}

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  console.log("Session status:", status);
  console.log("Session data:", session);
  
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mảng ảnh mẫu
  const sampleImages = [
    '/images/test01.jpg',
    '/images/test02.jpg',
    '/images/test03.jpg',
    '/images/test04.jpg',
    '/images/test05.jpg',
    '/images/test06.jpg',
    '/images/test07.jpg',
    '/images/test08.jpg',
    '/images/test09.jpg',
    '/images/test10.jpg',
    '/images/test11.jpg',
    '/images/test12.jpg',
    '/images/test13.jpg',
    '/images/test14.jpg',
  ];

  // Hàm lấy index ảnh dựa trên itemId
  const getImageIndex = (itemId: string) => {
    const numericValue = itemId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return numericValue % sampleImages.length;
  };

  // Hàm tăng số lượng
  const increaseQuantity = () => {
    if (item && quantity < item.quantity) {
      setQuantity(prev => prev + 1);
    }
  };

  // Hàm giảm số lượng
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  useEffect(() => {
    fetchItemDetail();
  }, [params.id]);

  const fetchItemDetail = async () => {
    try {
      const response = await fetch(`https://localhost:7121/api/Item/${params.id}`);
      const data: ApiResponse = await response.json();

      if (data.status === 200) {
        setItem(data.data);
      } else {
        setError('Không thể tải thông tin sản phẩm');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi tải thông tin sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!session?.user) {
      toastHelper.error("Vui lòng đăng nhập để mua hàng!");
      router.push('/login');
      return;
    }

    if (!item) return;

    // Thay vì gọi API purchase trực tiếp, chuyển sang trang payment với thông tin cần thiết
    router.push(`/order/payment?itemId=${item.itemId}&quantity=${quantity}`);
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Đang tải...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen">{error}</div>;
  if (!item) return <div className="flex justify-center items-center min-h-screen">Không tìm thấy sản phẩm</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-lg shadow-sm">
          {/* Phần ảnh bên trái */}
          <div className="md:w-2/5">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden group">
              <Image
                src={sampleImages[selectedImage]}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                priority
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            </div>
            
            {/* Thumbnail images */}
            <div className="mt-4 flex gap-2 overflow-x-auto">
              {sampleImages.slice(0, 5).map((img, index) => (
                <div 
                  key={index} 
                  className={`relative w-16 h-16 flex-shrink-0 rounded cursor-pointer
                    ${selectedImage === index ? 'border-2 border-red-500' : 'border border-gray-200'}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Share buttons */}
            <div className="mt-4 flex items-center gap-4">
              <span className="text-gray-600">Chia sẻ:</span>
              <div className="flex gap-2">
                <button className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600">
                  <span>FB</span>
                </button>
                <button className="p-2 rounded-full bg-blue-400 text-white hover:bg-blue-500">
                  <span>TW</span>
                </button>
                <button className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600">
                  <span>PIN</span>
                </button>
              </div>
            </div>
          </div>

          {/* Phần thông tin bên phải */}
          <div className="md:w-3/5">
            {/* Badge "Yêu thích" */}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-red-500 text-white text-sm rounded">Yêu Thích</span>
            </div>

            <h1 className="text-2xl mb-4">{item.name}</h1>

            {/* Rating & Đánh giá */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-red-500">4.6</span>
                <div className="flex text-yellow-400 ml-2">★★★★½</div>
              </div>
              <div className="text-gray-500 border-l border-r px-4">Mức độ uy tín: Cao</div>
              <div className="text-gray-500">Đã bán: </div>
            </div>

            {/* Giá */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-red-500">
                  {item.price.toLocaleString()}đ
                </span>
               
              </div>
            </div>


            {/* Thông tin vận chuyển */}
            <div className="mb-6">
              <div className="flex items-start gap-4 mb-4">
                <span className="w-24 text-gray-500">Vận Chuyển</span>
                <div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-truck"></i>
                    <span>Miễn phí vận chuyển</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Giao hàng từ 1-3 ngày
                  </div>
                </div>
              </div>
            </div>

            {/* Màu sắc */}
            <div className="mb-6">
              <div className="flex items-start gap-4">
                <span className="w-24 text-gray-500">Người Bán</span>
                <button 
                    onClick={() => alert('Tính năng đang phát triển')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100"
                  >
                    <FaComment />
                    <span>Chat ngay</span>
                  </button>
              </div>
            </div>

            {/* Số lượng */}
            <div className="flex items-center gap-4 mb-6">
              <span className="w-24 text-gray-500">Số Lượng</span>
              <div className="flex items-center">
                <div className="flex items-center border rounded">
                  <button 
                    onClick={decreaseQuantity}
                    className="px-3 py-1 border-r hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(parseInt(e.target.value) || 1, item.quantity)))}
                    className="w-16 text-center border-none focus:outline-none"
                  />
                  <button 
                    onClick={increaseQuantity}
                    className="px-3 py-1 border-l hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <span className="ml-4 text-gray-500">{item.quantity} sản phẩm có sẵn</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              {item.status === 0 ? (
                // Buttons khi còn hàng
                <>
                  <button className="flex-1 px-4 py-3 border border-red-500 text-red-500 rounded-lg hover:bg-red-50">
                    <i className="fas fa-cart-plus mr-2"></i>
                    Thêm Vào Giỏ Hàng
                  </button>
                  <button
                    onClick={handlePurchase}
                    disabled={isPurchasing || item.quantity === 0}
                    className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isPurchasing ? 'Đang xử lý...' : 'Mua Ngay'}
                  </button>
                </>
              ) : (
                // Button khi hết hàng
                <button 
                  onClick={() => alert(`Chúng tôi sẽ thông báo cho bạn khi ${item.name} có hàng trở lại!`)}
                  className="w-full px-4 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium"
                >
                  Thông báo khi có hàng
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
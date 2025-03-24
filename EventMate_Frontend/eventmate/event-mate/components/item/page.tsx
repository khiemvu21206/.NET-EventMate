"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import "@/styles/Item.css";
import Link from "next/link";
import { ItemRepository } from '@/repositories/ItemRepository';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Image from 'next/image';

interface ItemData {
  itemId: string;
  name: string;
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
  data: ItemData[];
  timestamp: number;
}

export default function OtherEventComponent() {
  const [items, setItems] = useState<ItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleItems, setVisibleItems] = useState<number>(4);
  
  // Thêm states cho search và sort
  const [searchName, setSearchName] = useState('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [sortOption, setSortOption] = useState('');
  
  // Thêm state cho filter trạng thái
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Ref cho infinite scroll
  const observerTarget = useRef<HTMLDivElement>(null);

  // Thêm mảng ảnh mẫu
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

  // Xử lý dữ liệu đã lọc và sắp xếp
  const filteredAndSortedItems = useCallback(() => {
    let result = [...items];
    
    // Lọc theo tên
    if (searchName) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }
    
    // Lọc theo date range
    if (startDate && endDate) {
      result = result.filter(item => {
        const itemDate = new Date(item.timeStart).getTime();
        return itemDate >= startDate.getTime() && itemDate <= endDate.getTime();
      });
    }
    
    // Lọc theo trạng thái
    if (statusFilter !== 'all') {
      result = result.filter(item => 
        item.status === (statusFilter === 'available' ? 0 : 1)
      );
    }
    
    // Sắp xếp
    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'date-asc':
        result.sort((a, b) => new Date(a.timeStart).getTime() - new Date(b.timeStart).getTime());
        break;
      case 'date-desc':
        result.sort((a, b) => new Date(b.timeStart).getTime() - new Date(a.timeStart).getTime());
        break;
    }
    
    return result;
  }, [items, searchName, dateRange, sortOption, statusFilter]);

  useEffect(() => {
    fetchItems();
  }, []);

  // Xử lý infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && items.length > visibleItems) {
          // Khi scroll đến cuối, tăng thêm 4 items
          setVisibleItems(prev => prev + 4);
        }
      },
      { threshold: 0.1 } // Giảm threshold để dễ trigger hơn
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [items.length, visibleItems]);

  const fetchItems = async () => {
    try {
      const response = await fetch('https://localhost:7121/api/Item');
      const data: ApiResponse = await response.json();
      
      if (data.status === 200) {
        setItems(data.data);
      } else {
        setError('Không thể tải dữ liệu');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (itemId: string) => {
    try {
        const response = await ItemRepository.purchaseItem({
            buyerId: "D39BF95E-E6C3-41A6-94B1-DF92AACE83A2",
            itemId: itemId,
            quantity: 1
        });
        
        if (response.data.status === 200) {
            alert('Mua hàng thành công!');
            await fetchItems();
        } else {
            alert('Có lỗi xảy ra: ' + response.data.key);
        }
    } catch (error) {
        console.error('Error purchasing item:', error);
        alert('Đã có lỗi xảy ra khi mua hàng');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
  
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search và Sort controls */}
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search by name */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Date Range Picker */}
          <div className="relative">
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                setDateRange(update);
              }}
              isClearable={true}
              placeholderText="Chọn khoảng thời gian..."
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              dateFormat="dd/MM/yyyy"
            />
          </div>

          {/* Status Filter - Thêm mới */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="available">Còn hàng</option>
              <option value="unavailable">Hết hàng</option>
            </select>
          </div>
          
          {/* Sort options */}
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sắp xếp theo...</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
              <option value="name-asc">Tên A-Z</option>
              <option value="name-desc">Tên Z-A</option>
              <option value="date-asc">Ngày tăng dần</option>
              <option value="date-desc">Ngày giảm dần</option>
            </select>
          </div>
        </div>
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filteredAndSortedItems().slice(0, visibleItems).map((item, index) => (
          <div key={item.itemId} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
            {/* Thêm phần ảnh */}
            <div className="relative w-full h-48">
              <Image
                src={sampleImages[index % sampleImages.length]}
                alt={item.name}
                fill
                className="object-cover"
                priority={index < 4}
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-2">
                {item.name}
              </h3>
              <div className="text-sm text-gray-600 mb-2 flex items-center">
                <span className="mr-2">🗓️</span>
                <span>{new Date(item.timeStart).toLocaleDateString()}</span>
              </div>
              <div className="text-red-600 font-bold text-lg">
                {item.price.toLocaleString()} VND
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Còn lại: {item.quantity}
              </div>
              <div className={`mt-2 text-sm px-2 py-1 rounded-full inline-block ${
                item.status === 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {item.status === 0 ? 'Còn hàng' : 'Hết hàng'}
              </div>

              <div className="mt-4 flex gap-2">
                <Link 
                  href={`/item/${item.itemId}`}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md text-center text-sm font-bold hover:bg-gray-400 transition-colors"
                >
                  Xem chi tiết
                </Link>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Tính năng đang phát triển!');
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-bold hover:bg-gray-400 transition-colors"
                >
                  Liên hệ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {visibleItems < items.length && (
        <div 
          ref={observerTarget}
          className="flex justify-center p-4 mt-4"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  );
}

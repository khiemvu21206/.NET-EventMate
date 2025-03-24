'use client'
import { FriendRepository } from '@/repositories/FriendRepository';
import { useState, useEffect, useCallback } from 'react';
import InfiniteScroll from '@/components/basic/InfiniteScroll';
import { debounce } from "lodash";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import FriendSidebar from '@/components/group/friend/FriendSidebar';
import { Friend } from '@/model/common';

const FriendList = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [keySearch, setKeySearch] = useState<string>('');
  const pageSize = 8;

  const fetchFriends = async (page: number = 1, search: string = '') => {
    try {
      setIsLoading(true);
      const response = await FriendRepository.getListFriends({
        currentPage: page,
        pageSize,
        keySearch: search
      });

      if (response?.data) {
        if (page === 1) {
          setFriends(response.data.data);
        } else {
          setFriends(prev => [...prev, ...response.data.data]);
        }
        setTotalCount(response.data.totalCount);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error('Error fetching friends:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfrined = async (friendId: string) => {
    try {
     const res= await FriendRepository.unfriend(friendId);
  if(res.status===200){
    setFriends(friends.filter(friend => friend.friend.userId !== friendId));
  }
    } catch (err) {
      console.error('Error unfriend:', err);
    }
  }

  const handleLoadMore = () => {
    fetchFriends(currentPage + 1, keySearch);
  };

  const handleSearch = (value: string) => {
    setKeySearch(value);
    setCurrentPage(1);
    debouncedSearch.cancel();
    debouncedSearch();
  };

  const debouncedSearch = useCallback(
    debounce(() => {
      fetchFriends(1, keySearch);
    }, 600),
    []
  );

  useEffect(() => {
    fetchFriends();
  }, []);

  const FriendSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="animate-pulse bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="w-full h-40 bg-gray-200"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-9 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const FriendCard = ({ friend }: { friend: Friend }) => (

      <div className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors rounded-lg">
                <div className="relative w-16 h-16">
                    <Image
                       src={friend?.friend.avatar || '/images/default-avatar.png'}
                       alt={friend?.friend.fullName || friend?.friend.email || ''}
                        fill
                        sizes="(max-width: 64px) 100vw, 64px"
                        className="rounded-lg object-cover"
                    />
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{friend?.friend.fullName || friend?.friend.email}</h3>
                </div>
                <button className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                onClick={() => handleUnfrined(friend.friend.userId || '')}>
                    Hủy kết bạn
                </button>
            </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
         <FriendSidebar activeNav="all" />
      <div className="flex-1 ml-80">
        <div className="max-w-7xl mx-auto bg-white min-h-screen">
          <div className="p-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên..."
                value={keySearch}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="pt-4">
            <InfiniteScroll
              hasMore={friends?.length < totalCount}
              isEmpty={!friends || friends.length === 0}
              isLoading={isLoading}
              fetchMore={handleLoadMore}
              className="space-y-4"
              skeleton={<FriendSkeleton />}
              emptyMessage={
                <div className="text-center py-10 text-gray-500">
                  Không có bạn bè nào
                </div>
              }
            >
                 <div className="grid grid-cols-2 gap-4 p-4">
                {friends && friends.length > 0 && friends.map(friend => (
                  <FriendCard key={friend.id} friend={friend} />
                ))}
              </div>
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendList;

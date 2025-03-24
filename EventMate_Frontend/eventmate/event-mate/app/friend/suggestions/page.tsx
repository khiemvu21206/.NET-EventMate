'use client'
import { FriendRepository } from '@/repositories/FriendRepository';
import { useState, useEffect, useCallback } from 'react';

import InfiniteScroll from '@/components/basic/InfiniteScroll';
import { debounce } from "lodash";
import PendingRequestsModal from '@/components/group/friend/PendingRequestsModal';
import FriendSidebar from '@/components/group/friend/FriendSidebar';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface UserSuggestion {
  userId: string;
  fullName: string;
  avatar: string | null;
  email: string;
  description: string | null;
  address: string | null;

}

const FriendSuggestions = () => {
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [keySearch, setKeySearch] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const pageSize = 8;
  const [retryCallback, setRetryCallback] = useState<number>(0);
  const fetchSuggestions = async () => {
    try {
      setIsLoading(true);
      const response = await FriendRepository.getFriendSuggestions({
        currentPage: currentPage,
        pageSize,
        keySearch: keySearch
      });

      if (response?.data) {
        if (currentPage === 1) {
          setSuggestions(response.data.data);
        } else {
          const newSuggestions = response.data.data;
          setSuggestions(prev => {
            const uniqueUsers = new Map(prev.map(user => [user.userId, user]));
            newSuggestions.forEach((user: UserSuggestion) => uniqueUsers.set(user.userId, user));
            return Array.from(uniqueUsers.values());
          });
        }
        setTotalCount(response.data.totalCount);
      }
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchSuggestions();
  }
    , [retryCallback, currentPage]);
  const handleLoadMore = () => {
   setCurrentPage(currentPage + 1);
   setRetryCallback(new Date().getTime());
  };

  const handleSearch = (value: string) => {
    setKeySearch(value);
    setCurrentPage(1);
    debouncedSearch.cancel();
    debouncedSearch();
  };

  const debouncedSearch = useCallback(
    debounce(() => {
      setRetryCallback(new Date().getTime());
    }, 600),
    []
  );

  const handleAddFriend = async (friendId: string) => {
    try {

      await FriendRepository.requestAddFriend(friendId);
      setSuggestions(prev => prev.filter(s => s.userId !== friendId));
      setTotalCount(prev => prev - 1);
    } catch (err) {
      console.error('Error sending friend request:', err);
    }
  };
  const SuggestionSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="animate-pulse bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[360px]">
          <div className="w-full h-40 bg-gray-200"></div>
          <div className="p-4 flex flex-col flex-grow">
            <div className="flex-grow">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-4/5 mb-3"></div>
            </div>
            <div className="h-9 bg-gray-300 rounded w-full mt-auto"></div>
          </div>
        </div>
      ))}
    </div>
  );


  const SuggestionCard = ({ suggestion }: { suggestion: UserSuggestion }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-[360px]">
      <div className="relative w-full h-40 flex-shrink-0">
  <img
    src={suggestion?.avatar || '/images/default-avatar.png'}
    alt={suggestion.fullName}
    className="object-cover w-full h-full"
  />
</div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{suggestion.fullName || suggestion.email}</h3>
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {suggestion.email}
          </p>
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">
            {suggestion.description}
          </p>
        </div>
        <button
          onClick={() => handleAddFriend(suggestion.userId)}
          className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors mt-auto"
        >
          Thêm bạn bè
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <FriendSidebar activeNav="suggestions" />

      {/* Main Content */}
      <div className="flex-1 ml-80">
        <div className="max-w-7xl mx-auto bg-white min-h-screen">
          {/* Header */}
          <div className="fixed left-80 right-0 top-[72px] z-20 bg-gray-50">
            <div className="bg-white border-b border-gray-200 shadow-sm">
              <div className="max-w-7xl mx-auto">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Những người bạn có thể biết</h1>
                      <p className="text-sm text-gray-500 mt-1">Gợi ý kết bạn dựa trên mối quan hệ chung</p>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center px-4 py-2 text-white bg-gray-900 hover:bg-gray-700 rounded-md transition-colors"
                    >
                      Lời mời đã gửi
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tên hoặc trường học, công ty..."
                      value={keySearch}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Suggestions List */}
          <div className="pt-[160px] p-4">
            <InfiniteScroll
              hasMore={suggestions.length < totalCount}
              isEmpty={suggestions.length === 0}
              isLoading={isLoading}
              fetchMore={handleLoadMore}
              className="space-y-4"
              skeleton={
                <div className="p-4">
                  <SuggestionSkeleton />
                </div>
              }
              emptyMessage={
                <div className="text-center py-10 text-gray-500">
                  Không có gợi ý kết bạn nào
                </div>
              }
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {suggestions.map(suggestion => (
                  <SuggestionCard key={suggestion.userId} suggestion={suggestion} />
                ))}
              </div>
            </InfiniteScroll>
          </div>
        </div>
      </div>

      {/* Pending Requests Modal */}
      <PendingRequestsModal
        modalProps={
          {
            isOpen: isModalOpen,
            closeModal: () => setIsModalOpen(false),
            title: 'Lời mời kết bạn đã gửi',
          }
        }
      />
    </div>
  );

};

export default FriendSuggestions; 
"use client";
import React, { useState, useEffect } from 'react';
import { useUserContext } from "@/providers/UserProvider";
import { GroupRepository } from '@/repositories/GroupRepository';
import { useRouter } from 'next/navigation';
import { CalendarIcon } from '@heroicons/react/24/outline';

function ChatItem({ avatar, name, createAt, totalMember, groupId, onClick, event }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div
      onClick={onClick}
      className="
        flex items-center p-4 
        hover:bg-gray-100/80 
        rounded-xl
        cursor-pointer
        transition-all duration-200
        border border-transparent
        hover:border-gray-200
        hover:shadow-sm
      "
    >
      {/* Group Image */}
      <div className="relative">
        <img
          src={avatar || "/images/default-group-avatar.jpg"}
          alt={name}
          className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-md"
        />
        {event && (
          <div className="absolute -bottom-2 -right-2">
            <img
              src={event.img || "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}
              alt={event.name}
              className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-md"
            />
          </div>
        )}
      </div>
      
      <div className="flex-1 ml-4 overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900 truncate">{name}</h3>
            <p className="text-sm text-gray-500 truncate mt-0.5">
              {totalMember} thành viên
            </p>
          </div>
        </div>

        {event && (
          <div className="mt-1.5">
            <p className="text-sm font-medium text-gray-700 truncate">
              {event.name}
            </p>
            <div className="flex items-center mt-1 space-x-4">
              <div className="flex items-center text-xs text-gray-500">
                <CalendarIcon className="w-3.5 h-3.5 mr-1" />
                <span className="truncate">
                  {event.timeStart && event.timeEnd ? (
                    `${formatDate(event.timeStart)} - ${formatDate(event.timeEnd)}`
                  ) : (
                    formatDate(createAt)
                  )}
                </span>
              </div>
              {event.place && (
                <p className="text-xs text-gray-500 truncate flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.place}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatPopUp() {
  const { id } = useUserContext();
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      const response = await GroupRepository.getAllGroupByUserId(
        id,
        searchTerm,
        '', // sortBy
        true, // ascending
        1, // currentPage
        10 // pageSize
      );

      if (response.status === 200) {
        setGroups(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchGroups();
    }
  }, [id, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleGroupClick = (groupId) => {
    router.push(`/group/member/${groupId}`);
  };

  return (
    <div className="relative w-full md:w-[500px] max-w-[600px] bg-gray-50 rounded-2xl shadow-xl border border-gray-200">
      {/* Search box */}
      <div className="p-4 border-b bg-gray-50 rounded-t-2xl backdrop-blur-sm">
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm nhóm..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-sm placeholder-gray-400 text-gray-900 outline-none focus:ring-2 ring-gray-100 transition-all"
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="max-h-[600px] overflow-y-auto p-4 space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Không tìm thấy nhóm nào</p>
          </div>
        ) : (
          groups.map((group) => (
            <ChatItem
              key={group.groupId}
              avatar={group.img}
              name={group.groupName}
              createAt={group.createdAt}
              totalMember={group.totalMember}
              groupId={group.groupId}
              onClick={() => handleGroupClick(group.groupId)}
              event={group.event}
            />
          ))
        )}
      </div>
    </div>
  );
}
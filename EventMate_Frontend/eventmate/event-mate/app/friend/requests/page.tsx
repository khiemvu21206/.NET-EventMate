'use client';

import InfiniteScroll from "@/components/basic/InfiniteScroll";

import FriendSidebar from "@/components/group/friend/FriendSidebar";
import { RequestList } from "@/model/common";
import { FriendRepository } from "@/repositories/FriendRepository";
import { uniqBy } from "lodash";
import Image from "next/image";
import {  useEffect, useState } from "react";

export type SortDirection = 'asc' | 'desc';

interface FriendRequest {
    id: string;
    sender: {
        userId: string;
        fullName: string;
        email: string;
        avatar: string;
    };
    status: string;
    createdAt: string;
    mutualFriendsCount: number;
}

const FriendRequestsPage = () => {
    const [totalCount, setTotalCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [retryCall, setRetryCall] = useState<number>(0);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);



    const handlePageLoadMore = () => {
        setCurrentPage(currentPage + 1);
        setRetryCall(new Date().getTime());
    };

    const getRequestQueries = () => {
        const request: RequestList = {
            currentPage,
            pageSize: 8,
            ascending: true,
            sortBy: 'createdAt',
        };
        return request;
    };

    const getListRequests = async () => {
        try {
            setIsLoading(true);
            const params = getRequestQueries();
            const res = await FriendRepository.getFriendRequests(params);

            if (!res.error) {
                if (currentPage > 1) {
                    setFriendRequests((current) => {
                        return uniqBy([...current, ...res.data.data], 'id');
                    });
                } else {
                    setFriendRequests(res.data.data);
                }
                setTotalCount(res.data.totalCount);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getListRequests();
    }, [retryCall, currentPage]);

    const handleAcceptRequest = async (requestId: string) => {
        try {
            await FriendRepository.acceptFriendRequest(requestId);
            setRetryCall(new Date().getTime());
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const handleRejectRequest = async (requestId: string) => {
        try {
            await FriendRepository.rejectFriendRequest(requestId);
            setRetryCall(new Date().getTime());
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        }
    };
    const RequestSkeleton = () => (
        <div className="space-y-4">
            {[1, 2, 3].map((item) => (
                <div key={item} className="animate-pulse bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-gray-200 h-16 w-16"></div>
                        <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                        </div>
                        <div className="flex space-x-2">
                            <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
                            <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
    const RequestCard = ({ request }: { request: FriendRequest }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="relative h-16 w-16 flex-shrink-0">
                        <Image
                            src={request?.sender.avatar}
                            alt={request?.sender.fullName || request?.sender.email}
                            fill
                            className="object-cover rounded-full"
                        />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{request?.sender.fullName || request?.sender.email}</h3>
                        <p className="text-sm text-gray-400 mt-1">
                            Đã gửi lời mời vào {request.createdAt}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handleAcceptRequest(request.id)}
                        className="px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Chấp nhận
                    </button>
                    <button
                        onClick={() => handleRejectRequest(request.id)}
                        className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Từ chối
                    </button>
                </div>
            </div>
        </div>
    );
    return (

        <div className="flex min-h-screen bg-gray-50">
            {/* Left Sidebar */}
            <FriendSidebar activeNav="requests" />

            {/* Main Content */}
            <div className="flex-1 ml-80">
                <div className="max-w-5xl mx-auto bg-white min-h-screen">
                    {/* Header */}
                    <div className="fixed left-80 right-0 top-[72px] z-20 bg-gray-50">
                        <div className="bg-white border-b border-gray-200 shadow-sm">
                            <div className="max-w-5xl mx-auto">
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900">Lời mời kết bạn</h1>
                                        </div>
                                    </div>

                                    {/* Search Bar */}
                                    {/* <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Tìm kiếm trong lời mời kết bạn..."
                                                    value={keySearch}
                                                    onChange={(e) => handleChangeSearch(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Requests List */}
                    <div className="pt-[160px] p-4">
                        <InfiniteScroll
                            hasMore={friendRequests.length < totalCount}
                            isLoading={isLoading}
                            fetchMore={handlePageLoadMore}
                            isEmpty={!(friendRequests && friendRequests.length > 0)}
                            className="space-y-4"
                            skeleton={<RequestSkeleton />}
                            emptyMessage={
                                <div className="text-center py-10">
                                    <p className="text-gray-500">Không có lời mời kết bạn nào</p>
                                </div>
                            }
                        >
                            <div className="space-y-4">
                                {friendRequests.map(request => (
                                    <RequestCard key={request.id} request={request} />
                                ))}
                            </div>
                        </InfiniteScroll>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FriendRequestsPage; 
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { FriendRepository } from '@/repositories/FriendRepository';
import InfiniteScroll from '@/components/basic/InfiniteScroll';
import Modal, { ModalProps } from '@/components/basic/Modal';
import { Friend } from '@/model/common';

type PendingRequestsModalProps = {
    modalProps: ModalProps;
};

export default function PendingRequestsModal({ modalProps }: PendingRequestsModalProps) {

    const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 8;

    const getPendingRequests = async (page = 1) => {
        try {
            setIsLoading(true);
            const response = await FriendRepository.getListPending({
                currentPage: page,
                pageSize,
            });

            if (response?.data) {
                if (page === 1) {
                    setPendingRequests(response.data.data);
                } else {
                    setPendingRequests(prev => [...prev, ...response.data.data]);
                }
                setTotalCount(response.data.totalCount);
                setCurrentPage(page);
            }
        } catch (error) {
            console.error('Error fetching pending requests:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadMore = () => {
        if (pendingRequests.length < totalCount) {
            getPendingRequests(currentPage + 1);
        }
    };

    useEffect(() => {
        if (modalProps.isOpen) {
            setCurrentPage(1);
            setPendingRequests([]);
            getPendingRequests();
        }
    }, [modalProps.isOpen]);

    const onCancelRequest = async (requestId: any) => {
        try {
            const response = await FriendRepository.cancelFriendRequest(requestId);
            if (response?.data) {
                setPendingRequests((prev) => prev.filter((request) => request.id !== requestId));
            }
        } catch (error) {
            console.error('Error canceling request:', error);
        }
    };

    return (
        <Modal {...modalProps} widthMd='w-[800px]'>
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-120px)] ">
                <InfiniteScroll
                    hasMore={pendingRequests.length < totalCount}
                    isEmpty={pendingRequests.length === 0}
                    isLoading={isLoading}
                    fetchMore={handleLoadMore}
                    className="space-y-4"
                    emptyMessage={
                        <div className="text-center text-gray-500 py-8">
                            Không có lời mời kết bạn nào đang chờ
                        </div>
                    }
                >
                    {pendingRequests.map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center space-x-4">
                                <div className="relative w-12 h-12">
                                    <img
                                        src={request?.friend.avatar || "/default-avatar.png"}
                                        alt={request?.friend.fullName || request?.friend.email || ''}

                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="relative w-full h-40 flex-shrink-0">

                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">{request?.friend.fullName}</h3>
                                </div>
                            </div>
                            <button
                                onClick={() => onCancelRequest(request?.id)}
                                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors bg-red-100 border border-red-200"
                            >
                                Hủy yêu cầu
                            </button>
                        </div>
                    ))}
                </InfiniteScroll>
            </div>
        </Modal>
    );
};


"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { debounce, uniqBy } from "lodash";
import { useRouter } from "next/navigation";
import { FaCheck } from "react-icons/fa";

import LeftNavbar from "@/components/event/createEvent/LeftNavbarComponent";
import TopNavbar from "@/components/event/createEvent/TopNavbarComponent";
import HeaderTableRender from "@/components/basic/HeaderTableRender";
import InfiniteScroll from "@/components/basic/InfiniteScroll";
import { TableSkeleton } from "@/components/basic/Table";
import { Button } from "@/components/common/button";
import Input from "@/components/common/Input";
import { useDebounceFn } from "@/lib/debounceFn";
import { RequestList } from "@/model/common";
import { EventRepository } from "@/repositories/EventRepository";
import { useLanguage } from "@/providers/LanguageProvider";
import { useUserContext } from "@/providers/UserProvider";
import  Tooltip  from "@/components/common/Tooltip";

export type SortDirection = 'asc' | 'desc';

interface Event {
  eventId: string;
  name: string;
  description: string;
  timeStart: string;
  timeEnd: string;
  place: string;
  maxParticipants: number;
  currentParticipants: number;
  status: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  img: string;
}

export default function EventRequestPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { id: userId, status: authStatus } = useUserContext();
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCall, setRetryCall] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filter, setFilter] = useState<RequestList>();
  const [keySearch, setKeySearch] = useState<string>('');
  const [listEvents, setListEvents] = useState<Event[]>([]);
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [sortKey, setSortKey] = useState<string | null>('createdAt');
  const pageSize = 8;

  const handlePageLoadMore = () => {
    setCurrentPage(currentPage + 1);
    setRetryCall(new Date().getTime());
  };

  const getRequestQueries = () => {
    const request: RequestList = {
      currentPage,
      pageSize,
      keySearch,
      sortBy: sortKey || '',
      ascending: sortDirection === 'asc',
    };
    return request;
  };

  const getListEvents = async () => {
    try {
      if (authStatus === "unauthenticated") {
        setError("Vui lòng đăng nhập để xem danh sách sự kiện");
        router.push("/auth/login");
        return;
      }

      if (!userId) {
        setError("Không tìm thấy thông tin người dùng");
        return;
      }

      setIsLoading(true);
      setError(null);
      const params = getRequestQueries();
      const res = await EventRepository.getEventsByOrganizer(params);
      
      if (res.status === 200) {
        if(currentPage > 1){
          setListEvents((current) => {
            return uniqBy([...current, ...res.data.data], 'eventId');
          });
        } else {
          setListEvents(res.data.data);
        }
        setTotalCount(res.data.totalCount);
      }
    } catch (e) {
      console.log(e);
      setError("Có lỗi xảy ra khi tải danh sách sự kiện");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authStatus !== "loading") {
      getListEvents();
    }
  }, [retryCall, currentPage, authStatus]);

  const handleChangeFilter = (filter: RequestList) => {
    setFilter(filter);
    setCurrentPage(1);
    setRetryCall(new Date().getTime());
  };

  const handleChangeSearch = (value: string) => {
    const filterTmp = { ...filter || {} };
    filterTmp.keySearch = value || '';
    setFilter(filterTmp as RequestList);
    setKeySearch(value);
    debouncedSearch.cancel();
    debouncedSearch();
  };

  const debouncedSearch = useCallback(
    debounce(() => {
      handleSubmitFilter();
    }, 600),
    []
  );

  const { run: handleSubmitFilter } = useDebounceFn(() => {
    if (filter) {
      handleChangeFilter(filter);
    }
  });

  const baseHeaders = useMemo(
    () => [
      {
        key: 'img',
        filterKey: 'img',
        displayName: t('event:image'),
        width: '10%',
        sorted: false,
        textAlign: 'center',
      },
      {
        key: 'name',
        filterKey: 'name',
        displayName: t('event:name'),
        width: '20%',
        sorted: true,
      },
      {
        key: 'place',
        filterKey: 'place',
        displayName: t('event:place'),
        width: '15%',
        sorted: true,
      },
      {
        key: 'timeStart',
        filterKey: 'timeStart',
        displayName: t('event:time-start'),
        width: '15%',
        sorted: true,
      },
      {
        key: 'timeEnd',
        filterKey: 'timeEnd',
        displayName: t('event:time-end'),
        width: '15%',
        sorted: true,
      },
      {
        key: 'status',
        filterKey: 'status',
        displayName: t('event:status'),
        width: '10%',
        sorted: true,
      },
      {
        key: 'action',
        filterKey: 'action',
        displayName: t('event:action'),
        width: '10%',
        sorted: false,
        textAlign: 'center',
      },
    ],
    [t]
  );

  const toggleFilter = (key: string) => {
    let direction: SortDirection;
    if (key === sortKey) {
      direction = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      setSortKey(key);
      direction = 'desc';
    }
    setSortDirection(direction);
    handleSortData(key, direction);
  };

  const handleSortData = (field: string, direction: SortDirection) => {
    setSortKey(field);
    setSortDirection(direction);
    setRetryCall(new Date().getTime());
  };

  const handleApproveEvent = async (eventId: string) => {
    try {
      const res = await EventRepository.changeEventStatus(eventId, 2);
      if (res.status === 200) {
        setRetryCall(new Date().getTime());
      } else {
        alert('Có lỗi xảy ra khi duyệt sự kiện');
      }
    } catch (error) {
      console.error('Error approving event:', error);
      alert('Có lỗi xảy ra khi duyệt sự kiện');
    }
  };

  return (
    <div className="flex">
      {/* Thanh navbar bên trái */}
      <div className="fixed left-0 top-0 h-screen w-64 z-50">
        <LeftNavbar />
      </div>

      {/* Phần nội dung chính */}
      <div className="flex flex-col flex-1 ml-64 bg-gray-100 min-h-screen">
        {/* Navbar trên cùng */}
        <div className="fixed top-0 left-64 right-0 h-16 bg-gray-900 z-50">
          <TopNavbar currentTitle="Yêu cầu sự kiện" />
        </div>

         {/* Nội dung chính */}
         <div className="mt p-8">
          <div className="w-full">
            <div className="flex items-center md:flex-row md:justify-between flex-col relative">
              <div className="w-full items-center flex flex-wrap mb-5">
                <div className="text-xl font-semibold leading-7 inline-flex">
              
                </div>
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="w-[400px]">
                  <Input
                    className="w-full !h-11 pr-8 border"
                    type="text"
                    name="name"
                    value={keySearch}
                    onChange={(e) => handleChangeSearch(e.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        handleSubmitFilter();
                      }
                    }}
                    placeholder={t('commons:search')}
                  />
                </div>
                <div className="">
                  <Button
                    className="max-h-11"
                    label={t('commons:search')}
                    disabled={isLoading}
                    type="button"
                    onClickButton={handleSubmitFilter}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 mb-4">
              <div className="flex items-center bg-secondary-50 dark:bg-secondary-800 mt-[10px]">
                <HeaderTableRender
                  filterKey={sortKey || ''}
                  filterDirection={sortDirection}
                  bindingsHeaderTable={baseHeaders}
                  toggleFilter={toggleFilter}
                  className="flex items-center bg-secondary-50 dark:bg-secondary-800 table-header sticky py-3 text-xs font-medium"
                  filterPositionSuffix={false}
                />
              </div>
              <div className="mt-4">
                {error ? (
                  <div className="flex justify-center items-center h-[256px] text-red-500">
                    <span>{error}</span>
                  </div>
                ) : (
                  <InfiniteScroll
                    className={`w-full md:pb-[20px] max-h-[calc(100vh-300px)]`}
                    fetchMore={handlePageLoadMore}
                    hasMore={listEvents.length < totalCount}
                    isEmpty={!(listEvents && listEvents.length > 0)}
                    isLoading={isLoading}
                    retrySearchAgain={currentPage === 1 && isLoading}
                    skeleton={<TableSkeleton bindings={baseHeaders} />}
                    hasMaxHeight={false}
                    forceScrollTop={false}
                    emptyMessage={
                      <div className="flex justify-center items-center h-[256px]">
                        <span>{t('manage:no-data')}</span>
                      </div>
                    }
                  >
                    <div className="w-full">
                      {listEvents.map((event) => (
                        <div 
                          key={event.eventId} 
                          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => router.push(`/event/eventDetail/${event.eventId}`)}
                        >
                          <div className="flex items-center p-4">
                            {/* Image - 10% */}
                            <div className="w-[10%]">
                              <img
                                src={event.img || "/images/default-event.jpg"}
                                alt={event.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            </div>

                            {/* Name - 20% */}
                            <div className="w-[20%] px-4">
                              <h3 className="font-medium text-sm line-clamp-2">
                                {event.name}
                              </h3>
                            </div>

                            {/* Place - 15% */}
                            <div className="w-[15%] px-4">
                              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                                {event.place}
                              </p>
                            </div>

                            {/* Time Start - 15% */}
                            <div className="w-[15%] px-4">
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {new Date(event.timeStart).toLocaleDateString("vi-VN")}
                              </p>
                            </div>

                            {/* Time End - 15% */}
                            <div className="w-[15%] px-4">
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {new Date(event.timeEnd).toLocaleDateString("vi-VN")}
                              </p>
                            </div>

                            {/* Status - 10% */}
                            <div className="w-[10%] px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  event.status === 1
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                                }`}
                              >
                                                            {event.status === 1 ? "Đã công khai" : event.status === 2 ? "Chờ công khai" : event.status === 4 ? "Đang tạm dừng" : "Chờ xử lý"}
                              </span>
                            </div>

                            {/* Action - 10% */}
                            <div className="w-[10%] px-4 flex justify-center">
                              {event.status !== 1 && (
                                <Tooltip title="Duyệt">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleApproveEvent(event.eventId);
                                    }}
                                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm transition-colors"
                                  >
                                    <FaCheck />
                                  </button>
                                </Tooltip>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </InfiniteScroll>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 